import express from "express";
import { ObjectId } from "mongodb";
import QRCode from "qrcode";

const router = express.Router();

export default function artistRegisterRoutes(artistsCollection) {
  router.post("/", async (req, res) => {
    try {
      const {
        fullName,
        teamName,
        phone,
        email,
        teamSize,
        notes
      } = req.body;

      if (!fullName || !teamName || !phone || !email || !teamSize) {
        return res.json({ message: "Please fill all required fields." });
      }

      const qrId = new ObjectId().toString();

      const artistDoc = {
        fullName,
        teamName,
        phone,
        email,
        teamSize: Number(teamSize),
        notes: notes || "",
        qrId,
        checkedIn: false,
        checkedInAt: null,
        checkedInBy: null,
        checkedInCount: null,
        createdAt: new Date()
      };

      await artistsCollection.insertOne(artistDoc);

      const qrCodeDataUrl = await QRCode.toDataURL(qrId, {
  errorCorrectionLevel: "L",
  type: "image/png",
  margin: 1,
  scale: 6
});


      return res.json({
        success: true,
        message: "Artist registered successfully.",
        qrCode: qrCodeDataUrl,
        artist: {
          fullName,
          teamName,
          email,
          teamSize,
          qrId
        }
      });

    } catch (err) {
      console.error("Artist Register Error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  });

  return router;
}
