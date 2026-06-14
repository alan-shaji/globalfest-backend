import express from "express";

const router = express.Router();

export default function voteRoutes(votesCollection) {
  router.post("/", async (req, res) => {
    const { email, contestant } = req.body;

    if (!email || !contestant) {
      return res.json({ message: "Email and contestant are required." });
    }

    try {
      await votesCollection.insertOne({
        email,
        contestant,
        timestamp: Date.now()
      });

      return res.json({ message: "Your vote has been recorded!" });

    } catch (err) {
      if (err.code === 11000) {
        return res.json({ message: "This email has already voted." });
      }

      console.error(err);
      return res.json({ message: "Something went wrong." });
    }
  });

  return router;
}
