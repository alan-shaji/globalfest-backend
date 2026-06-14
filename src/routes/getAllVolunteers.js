import express from "express";

const router = express.Router();

export default function getAllVolunteersRoutes(volunteersCollection) {
  router.get("/", async (req, res) => {
    try {
      const volunteers = await volunteersCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.json({
        success: true,
        volunteers
      });

    } catch (err) {
      console.error("Get All Volunteers Error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  });

  return router;
}
