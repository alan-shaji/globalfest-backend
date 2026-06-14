import express from "express";

export default function adminVolunteersRoutes(volunteersCollection) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const volunteers = await volunteersCollection.find().toArray();
    res.json({ success: true, volunteers });
  });

  return router;
}
