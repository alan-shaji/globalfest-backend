import express from "express";

const router = express.Router();

export default function artistFeedbackRoutes(artistFeedbackCollection) {
  router.post("/", async (req, res) => {
    try {
      const feedbackData = req.body;

      await artistFeedbackCollection.insertOne({
        ...feedbackData,
        submittedAt: new Date()
      });

      res.json({
        success: true,
        message: "Artist feedback submitted successfully!"
      });

    } catch (error) {
      console.error("Artist Feedback Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit artist feedback"
      });
    }
  });

  return router;
}
