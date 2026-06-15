import express from "express";

export default function contestantsRoutes(contestantsCollection) {
  const router = express.Router();

  // GET: Fetch live data for your grid component
  router.get("/getAllContestants", async (req, res) => {
    try {
      // Find everything and sort by roster string/number order
      const list = await contestantsCollection.find().sort({ no: 1 }).toArray();
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch contestants from MongoDB." });
    }
  });

  return router;
}