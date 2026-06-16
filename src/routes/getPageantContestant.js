import express from "express";

const router = express.Router();

export default function getPageantContestantRoutes(pageantlistCollection) {
  router.get("/", async (req, res) => {
    try {
      const { qrId } = req.query;

      if (!qrId) {
        return res.json({ success: false, message: "QR ID is required." });
      }

      const contestant = await pageantlistCollection.findOne({ qrId });

      if (!contestant) {
        return res.json({ success: false, message: "Contestant not found." });
      }

      return res.json({ success: true, contestant });
    } catch (err) {
      console.error("Get Pageant Contestant Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}