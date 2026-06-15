import express from "express";

export default function getGalleryArtistsRoutes(artistsCollection) {
  const router = express.Router();

  // 1. GET ALL PUBLIC ARTISTS (For the grid view)
  router.get("/all", async (req, res) => {
    try {
      // Fetch all artists, converting the cursor into an array
      const artists = await artistsCollection.find({}).toArray();
      res.status(200).json(artists);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching gallery grid list", error: error.message });
    }
  });

  // 2. GET SINGLE ARTIST BY SLUG (For individual custom URL pages)
  router.get("/profile/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Look up using the unique clean text string, matching lowercases
      const artist = await artistsCollection.findOne({ slug: slug.toLowerCase() });
      
      if (!artist) {
        return res.status(404).json({ success: false, message: "Artist profile not found" });
      }
      
      res.status(200).json(artist);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching individual artist data", error: error.message });
    }
  });

  return router;
}