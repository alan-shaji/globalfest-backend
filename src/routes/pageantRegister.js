import express from "express";
import { ObjectId } from "mongodb";
import QRCode from "qrcode";

const router = express.Router();

export default function pageantRegisterRoutes(pageantlistCollection) {
  router.post("/", async (req, res) => {
    try {
      const { fullName, culture, gender, phone, email, notes } = req.body;

      if (!fullName || !culture || !gender || !phone || !email) {
        return res.json({ success: false, message: "Please fill all required fields." });
      }

      const qrId = new ObjectId().toString();

      const contestantDoc = {
        fullName,
        culture,
        gender,
        phone,
        email,
        notes: notes || "",
        qrId,
        checkedIn: false,
        checkedInAt: null,
        checkedInBy: null,
        numberOfPeople: 0, // Will be updated by the organizer during scan confirmation
        createdAt: new Date()
      };

      await pageantlistCollection.insertOne(contestantDoc);

      const qrCodeDataUrl = await QRCode.toDataURL(qrId, {
        errorCorrectionLevel: "L",
        type: "image/png",
        margin: 1,
        scale: 6
      });

      return res.json({
        success: true,
        message: "Pageant contestant registered successfully.",
        qrCode: qrCodeDataUrl,
        contestant: { fullName, culture, email, qrId }
      });

    } catch (err) {
      console.error("Pageant Register Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  return router;
}