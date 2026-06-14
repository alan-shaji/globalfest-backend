import express from "express";
import { ObjectId } from "mongodb";
import QRCode from "qrcode";

const router = express.Router();

export default function volunteerRegisterRoutes(volunteersCollection) {
  router.post("/", async (req, res) => {
    try {
      const {
        fullName,
        role,
        phone,
        email,
        notes
      } = req.body;

      // Required fields check
      if (!fullName || !role || !phone || !email) {
        return res.json({ message: "Please fill all required fields." });
      }

      // Generate unique QR ID
      const qrId = new ObjectId().toString();

      // Build volunteer document
      const volunteerDoc = {
        fullName,
        role,
        phone,
        email,
        notes: notes || "",
        qrId,
        checkedIn: false,
        checkedInAt: null,
        checkedInBy: null,
        createdAt: new Date()
      };

      // Insert into MongoDB
      await volunteersCollection.insertOne(volunteerDoc);

      // Generate QR Code (same settings as artist)
      const qrCodeDataUrl = await QRCode.toDataURL(qrId, {
        errorCorrectionLevel: "L",
        type: "image/png",
        margin: 1,
        scale: 6
      });

      // Response
      return res.json({
        success: true,
        message: "Volunteer registered successfully.",
        qrCode: qrCodeDataUrl,
        volunteer: {
          fullName,
          role,
          email,
          qrId
        }
      });

    } catch (err) {
      console.error("Volunteer Register Error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  });

  return router;
}
