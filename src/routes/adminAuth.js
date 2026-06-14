import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

export default function adminAuthRoutes(adminsCollection) {

  // REGISTER ADMIN
  router.post("/register", async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.json({ success: false, message: "Missing fields" });
      }

      const existing = await adminsCollection.findOne({ email });
      if (existing) {
        return res.json({ success: false, message: "Admin already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      await adminsCollection.insertOne({
        email,
        password: hashed,
        role,
        createdAt: new Date()
      });

      res.json({ success: true, message: "Admin registered" });

    } catch (err) {
      res.json({ success: false, message: "Server error" });
    }
  });

  // LOGIN ADMIN
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await adminsCollection.findOne({ email });
      if (!admin) {
        return res.json({ success: false, message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return res.json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          role: admin.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
        role: admin.role
      });

    } catch (err) {
      res.json({ success: false, message: "Server error" });
    }
  });

  return router;
}
