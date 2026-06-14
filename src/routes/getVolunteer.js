import express from "express";

const router = express.Router();

export default function getVolunteerRoutes(volunteersCollection) {
  router.get("/", async (req, res) => {
    try {
      const { qrId } = req.query;

      if (!qrId) {
        return res.json({ success: false, message: "QR ID is required." });
      }

      const volunteer = await volunteersCollection.findOne({ qrId });

      if (!volunteer) {
        return res.json({ success: false, message: "Volunteer not found." });
      }

      return res.json({
        success: true,
        volunteer
      });

    } catch (err) {
      console.error("Get Volunteer Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}
