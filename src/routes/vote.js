// import express from "express";

// const router = express.Router();

// export default function voteRoutes(votesCollection) {
//   router.post("/", async (req, res) => {
//     const { email, contestant } = req.body;

//     if (!email || !contestant) {
//       return res.json({ message: "Email and contestant are required." });
//     }

//     try {
//       await votesCollection.insertOne({
//         email,
//         contestant,
//         timestamp: Date.now()
//       });

//       return res.json({ message: "Your vote has been recorded!" });

//     } catch (err) {
//       if (err.code === 11000) {
//         return res.json({ message: "This email has already voted." });
//       }

//       console.error(err);
//       return res.json({ message: "Something went wrong." });
//     }
//   });

//   return router;
// }


import express from "express";
import dns from "dns";

const router = express.Router();

// A list of common fake/disposable email domains to reject on sight
const DISPOSABLE_DOMAINS = [
  "mailinator.com", "10minutemail.com", "yopmail.com", 
  "dispostable.com", "guerrillamail.com", "tempmail.com",
  "trashmail.com", "getairmail.com", "sharklasers.com"
];

// Helper function to check if a domain has active email servers (MX records)
const verifyDomainMX = (domain) => {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false); // No email servers found, domain is fake or inactive
      } else {
        resolve(true);  // Valid email server domain
      }
    });
  });
};

export default function voteRoutes(votesCollection) {
  router.post("/", async (req, res) => {
    const { email, contestant } = req.body;

    if (!email || !contestant) {
      return res.json({ message: "Email and contestant are required." });
    }

    // 1. Basic Structure Split
    const emailParts = email.toLowerCase().trim().split("@");
    if (emailParts.length !== 2) {
      return res.json({ message: "Please provide a valid email format." });
    }
    
    const domain = emailParts[1];

    // 2. Block Known Disposable Email Generators
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return res.json({ message: "Disposable or temporary emails are not allowed." });
    }

    // 3. DNS Verification (Catching fake domains like anything@any.com)
    const isRealDomain = await verifyDomainMX(domain);
    if (!isRealDomain) {
      return res.json({ message: "This email domain does not appear to exist. Please use a genuine email." });
    }

    // 4. Proceed to Database Entry if Checks Pass
    try {
      await votesCollection.insertOne({
        email: email.toLowerCase().trim(), // Normalize input to avoid casing workarounds
        contestant,
        timestamp: Date.now()
      });

      return res.json({ message: "Your vote has been recorded!" });

    } catch (err) {
      if (err.code === 11000) {
        return res.json({ message: "This email has already voted." });
      }

      console.error(err);
      return res.json({ message: "Something went wrong." });
    }
  });

  return router;
}