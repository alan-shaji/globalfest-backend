import express from "express";

const router = express.Router();

export default function adminArtistFeedbackRoutes(artistFeedbackCollection) {
  router.get("/", async (req, res) => {
    try {
      const feedback = await artistFeedbackCollection
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();

      res.json({ success: true, feedback });
    } catch (error) {
      console.error("Admin Artist Feedback Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load artist feedback",
      });
    }
  });

  return router;
}
