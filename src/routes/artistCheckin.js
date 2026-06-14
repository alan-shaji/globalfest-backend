import express from "express";

const router = express.Router();

export default function artistCheckinRoutes(artistsCollection) {
  router.post("/", async (req, res) => {
    try {
      const { qrId, arrivedCount, volunteerName, notes } = req.body;

      if (!qrId || !arrivedCount || !volunteerName) {
        return res.json({ success: false, message: "Missing required fields." });
      }

      const updated = await artistsCollection.updateOne(
        { qrId },
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

      if (updated.modifiedCount === 0) {
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
