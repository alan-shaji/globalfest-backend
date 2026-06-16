import express from "express";

export default function adminPageantRoutes(pageantCollection) {
  const router = express.Router();

  // Fetch all pageant contestants for the admin dashboard panel
  router.get("/", async (req, res) => {
    try {
      const contestants = await pageantCollection.find().toArray();
      res.json({ success: true, contestants });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch pageant registry." });
    }
  });

  return router;
}