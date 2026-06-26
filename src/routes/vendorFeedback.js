import express from "express";

const router = express.Router();

export default function vendorFeedbackRoutes(vendorFeedbackCollection) {
  // POST /api/vendor-feedback
  router.post("/", async (req, res) => {
    try {
      const feedbackData = req.body;

      await vendorFeedbackCollection.insertOne({
        ...feedbackData,
        submittedAt: new Date()
      });

      res.json({
        success: true,
        message: "Vendor feedback submitted successfully!"
      });

    } catch (error) {
      console.error("Vendor Feedback Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit vendor feedback"
      });
    }
  });

  return router;
}
