import express from "express";

export default function adminArtistsRoutes(artistsCollection) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const artists = await artistsCollection.find().toArray();
    res.json({ success: true, artists });
  });

  return router;
}
