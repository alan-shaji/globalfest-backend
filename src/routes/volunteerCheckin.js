import express from "express";

const router = express.Router();

export default function volunteerCheckinRoutes(volunteersCollection) {
  router.post("/", async (req, res) => {
    try {
      const { qrId, checkedInBy, notes, hours } = req.body;

      if (!qrId) {
        return res.json({ success: false, message: "QR ID is required." });
      }

      // Find volunteer
      const volunteer = await volunteersCollection.findOne({ qrId });

      if (!volunteer) {
        return res.json({ success: false, message: "Volunteer not found." });
      }

      // Update volunteer check-in status
      await volunteersCollection.updateOne(
        { qrId },
        {
          $set: {
            checkedIn: true,
            checkedInAt: new Date(),
            checkedInBy: checkedInBy || "Unknown",
            notes: notes || volunteer.notes || "",
            hours: hours || null
          }
        }
      );

      return res.json({
        success: true,
        message: "Volunteer checked in successfully."
      });

    } catch (err) {
      console.error("Volunteer Check-In Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}
