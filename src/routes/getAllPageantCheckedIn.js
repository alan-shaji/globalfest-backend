import express from "express";

const router = express.Router();

export default function getAllPageantCheckedInRoutes(pageantlistCollection) {
  router.get("/", async (req, res) => {
    try {
      // Find only contestants who are checked in and sort by latest arrival time
      const checkedInList = await pageantlistCollection
        .find({ checkedIn: true })
        .sort({ checkedInAt: -1 })
        .toArray();

      return res.json({
        success: true,
        count: checkedInList.length,
        data: checkedInList
      });
    } catch (err) {
      console.error("Get All Pageant Checked In Error:", err);
      return res.status(500).json({ success: false, message: "Server error retrieving records." });
    }
  });

  return router;
}