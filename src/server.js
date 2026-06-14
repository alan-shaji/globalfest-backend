// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./db/connect.js";
// import voteRoutes from "./routes/vote.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// async function startServer() {
//   const db = await connectDB();
//   const votesCollection = db.collection("votes");

//   // One email = one vote
//   await votesCollection.createIndex({ email: 1 }, { unique: true });

//   // Routes
//   app.use("/api/vote", voteRoutes(votesCollection));

//   // Start server
//   app.listen(process.env.PORT, () =>
//     console.log(`Server running on port ${process.env.PORT}`)
//   );
// }

// startServer();

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import voteRoutes from "./routes/vote.js";
import artistRegisterRoutes from "./routes/artistRegister.js";
import artistCheckinRoutes from "./routes/artistCheckin.js";
import getArtistRoutes from "./routes/getArtist.js";
import getAllArtistsRoutes from "./routes/getAllArtists.js"; 
import volunteerRegisterRoutes from "./routes/volunteerRegister.js";
import volunteerCheckinRoutes from "./routes/volunteerCheckin.js";
import getVolunteerRoutes from "./routes/getVolunteer.js";
import getAllVolunteersRoutes from "./routes/getAllVolunteers.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import { allowRoles } from "./middleware/roles.js";
import adminArtistsRoutes from "./routes/adminArtists.js";
import adminVolunteersRoutes from "./routes/adminVolunteers.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const db = await connectDB();

  // Collections
  const votesCollection = db.collection("votes");
  const artistsCollection = db.collection("artists"); 
  const volunteersCollection = db.collection("volunteers");
  const adminsCollection = db.collection("admins");
  



  // One email = one vote
  await votesCollection.createIndex({ email: 1 }, { unique: true });

  // Routes
  app.use("/api/vote", voteRoutes(votesCollection));

  app.use("/api/artist/register", artistRegisterRoutes(artistsCollection));
  app.use("/api/artist/checkin", artistCheckinRoutes(artistsCollection)); 
  app.use("/api/artist/get", getArtistRoutes(artistsCollection));
  app.use("/api/artist/all", getAllArtistsRoutes(artistsCollection));

  app.use("/api/volunteer/register", volunteerRegisterRoutes(volunteersCollection));
  app.use("/api/volunteer/checkin", volunteerCheckinRoutes(volunteersCollection));
  app.use("/api/volunteer/get", getVolunteerRoutes(volunteersCollection));
  app.use("/api/volunteer/all", getAllVolunteersRoutes(volunteersCollection));

  app.use("/api/admin/auth", adminAuthRoutes(adminsCollection));

  app.use(
  "/api/admin/artists",
  requireAdmin,
  allowRoles("full", "artist"),
  adminArtistsRoutes(artistsCollection)
);

app.use(
  "/api/admin/volunteers",
  requireAdmin,
  allowRoles("full", "volunteer"),
  adminVolunteersRoutes(volunteersCollection)
);

  app.use(
  "/api/admin/dashboard",
  requireAdmin,
  allowRoles("full", "artist", "volunteer"), // or only "full" if you want
  (req, res) => {
    res.json({ success: true, message: "Admin dashboard access granted" });
  }
);


  // Start server
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
}

startServer();
