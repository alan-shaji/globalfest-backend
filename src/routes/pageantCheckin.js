import express from "express";

const router = express.Router();

export default function pageantCheckinRoutes(pageantlistCollection) {
  router.post("/", async (req, res) => {
    try {
      const { qrId, checkedInBy, numberOfPeople, notes } = req.body;

      if (!qrId) {
        return res.json({ success: false, message: "QR ID is required." });
      }
      if (!checkedInBy) {
        return res.json({ success: false, message: "Organizer identity is required." });
      }

      const contestant = await pageantlistCollection.findOne({ qrId });

      if (!contestant) {
        return res.json({ success: false, message: "Contestant not found." });
      }

      if (contestant.checkedIn === true) {
        return res.json({ success: false, message: "This contestant has already been checked in!" });
      }

      await pageantlistCollection.updateOne(
        { qrId },
        {
          $set: {
            checkedIn: true,
            checkedInAt: new Date(),
            checkedInBy: checkedInBy,
            numberOfPeople: parseInt(numberOfPeople) || 1,
            notes: notes || contestant.notes || ""
          }
        }
      );

      return res.json({
        success: true,
        message: `${contestant.fullName} checked in successfully.`
      });

    } catch (err) {
      console.error("Pageant Check-In Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}