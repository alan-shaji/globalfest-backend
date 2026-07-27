import express from "express";
import dns from "dns";

const router = express.Router();

const DISPOSABLE_DOMAINS = [
  "mailinator.com", "10minutemail.com", "yopmail.com", 
  "dispostable.com", "guerrillamail.com", "tempmail.com",
  "trashmail.com", "getairmail.com", "sharklasers.com"
];

const verifyDomainMX = (domain) => {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

// ACCEPT THE AUTH MIDDLEWARES FROM SERVER.JS
export default function voteRoutes(votesCollection, requireAdmin, allowRoles) {
  
  // exact token checks and role systems
  router.get(
    "/results", 
    requireAdmin, 
    allowRoles("full", "pageant"), 
    async (req, res) => {
      try {
        const standings = await votesCollection.aggregate([
          {
            $group: {
              _id: "$contestant",
              totalVotes: { $sum: 1 }
            }
          },
          { $sort: { totalVotes: -1 } }
        ]).toArray();

        return res.json({ success: true, standings });
      } catch (err) {
        console.error("Aggregation Error:", err);
        return res.status(500).json({ success: false, message: "Could not retrieve standings." });
      }
    }
  );


  router.post("/", async (req, res) => {
    const { email, contestant } = req.body;

    if (!email || !contestant) {
      return res.json({ message: "Email and contestant are required." });
    }

    const emailParts = email.toLowerCase().trim().split("@");
    if (emailParts.length !== 2) {
      return res.json({ message: "Please provide a valid email format." });
    }
    
    const domain = emailParts[1];

    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return res.json({ message: "Disposable or temporary emails are not allowed." });
    }

    const isRealDomain = await verifyDomainMX(domain);
    if (!isRealDomain) {
      return res.json({ message: "This email domain does not appear to exist. Please use a genuine email." });
    }

    try {
      await votesCollection.insertOne({
        email: email.toLowerCase().trim(),
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