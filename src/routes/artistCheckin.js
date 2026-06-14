// import express from "express";

// const router = express.Router();

// export default function artistCheckinRoutes(artistsCollection) {
//   router.post("/", async (req, res) => {
//     try {
//       const { qrId, arrivedCount, volunteerName, notes } = req.body;

//       if (!qrId || !arrivedCount || !volunteerName) {
//         return res.json({ success: false, message: "Missing required fields." });
//       }

//       const updated = await artistsCollection.updateOne(
//         { qrId },
//         {
//           $set: {
//             checkedIn: true,
//             checkedInAt: new Date(),
//             checkedInBy: volunteerName,
//             checkedInCount: Number(arrivedCount),
//             checkinNotes: notes || ""
//           }
//         }
//       );

//       if (updated.modifiedCount === 0) {
//         return res.json({ success: false, message: "Artist not found." });
//       }

//       return res.json({
//         success: true,
//         message: "Artist successfully checked in."
//       });

//     } catch (err) {
//       console.error("Check-In Error:", err);
//       return res.status(500).json({ success: false, message: "Server error." });
//     }
//   });

//   return router;
// }


import express from "express";

const router = express.Router();

export default function artistCheckinRoutes(artistsCollection) {
  router.post("/", async (req, res) => {
    try {
      const { qrId, arrivedCount, volunteerName, notes } = req.body;

      if (!qrId || !arrivedCount || !volunteerName) {
        return res.json({ success: false, message: "Missing required fields." });
      }

      // CRITICAL FIX: Only update if checkedIn is currently false
      const updated = await artistsCollection.updateOne(
        { qrId, checkedIn: false }, // <--- Added condition here
        {
          $set: {
            checkedIn: true,
            checkedInAt: new Date(),
            checkedInBy: volunteerName,
            checkedInCount: Number(arrivedCount),
            checkinNotes: notes || ""
          }
        }
      );

      // If modifiedCount is 0, they either don't exist OR they are already checked in
      if (updated.modifiedCount === 0) {
        // Let's check which one it is so we can give an accurate error message
        const artistExists = await artistsCollection.findOne({ qrId });
        if (artistExists) {
          return res.json({ success: false, message: "This artist has already been checked in!" });
        }
        return res.json({ success: false, message: "Artist not found." });
      }

      return res.json({
        success: true,
        message: "Artist successfully checked in."
      });

    } catch (err) {
      console.error("Check-In Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}