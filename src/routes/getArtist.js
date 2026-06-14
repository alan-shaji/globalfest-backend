import express from "express";

const router = express.Router();

export default function getArtistRoutes(artistsCollection) {
  router.get("/", async (req, res) => {
    try {
      const { qrId } = req.query;

      console.log("BACKEND RECEIVED:", qrId);

      if (!qrId) {
        return res.json({ success: false, message: "QR ID missing." });
      }

      const artist = await artistsCollection.findOne({ qrId });

      if (!artist) {
        return res.json({ success: false, message: "Artist not found." });
      }

      return res.json({
        success: true,
        artist
      });

    } catch (err) {
      console.error("Get Artist Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}
