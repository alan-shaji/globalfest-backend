import express from "express";

const router = express.Router();

export default function adminVendorFeedbackRoutes(vendorFeedbackCollection) {
  router.get("/", async (req, res) => {
    try {
      const feedback = await vendorFeedbackCollection
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();

      res.json({ success: true, feedback });
    } catch (error) {
      console.error("Admin Vendor Feedback Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load vendor feedback",
      });
    }
  });

  return router;
}
