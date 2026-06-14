import express from "express";
const router = express.Router();

export default function getAllArtistsRoutes(artistsCollection) {
  router.get("/", async (req, res) => {
    try {
      const artists = await artistsCollection
        .find({})
        .sort({ checkedIn: -1, fullName: 1 })
        .toArray();

      return res.json({ success: true, artists });
    } catch (err) {
      console.error("Get All Artists Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}
