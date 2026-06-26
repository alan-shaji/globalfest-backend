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
import getGalleryArtistsRoutes from "./routes/getGalleryArtists.js"; 
// ⏬ ADD THIS IMPORT AT THE TOP
import contestantsRoutes from "./routes/contestants.js"; 
import pageantRegisterRoutes from "./routes/pageantRegister.js";
import getPageantContestantRoutes from "./routes/getPageantContestant.js";
import pageantCheckinRoutes from "./routes/pageantCheckin.js";
import getAllPageantCheckedInRoutes from "./routes/getAllPageantCheckedIn.js";
import adminPageantRoutes from "./routes/adminPageant.js";
import vendorFeedbackRoutes from "./routes/vendorFeedback.js";
import adminVendorFeedbackRoutes from "./routes/adminVendorFeedback.js";
import artistFeedbackRoutes from "./routes/artistFeedback.js";
import adminArtistFeedbackRoutes from "./routes/adminArtistFeedback.js";




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
  const galleryArtistsCollection = db.collection("galleryartists");
  // ⏬ ADD THIS LINE FOR YOUR COLLECTION
  const contestantsCollection = db.collection("contestants");
  const pageantlistCollection = db.collection("pageantlist");
  const vendorFeedbackCollection = db.collection("vendorfeedback");
  const artistFeedbackCollection = db.collection("artistfeedback");

 



  // One email = one vote
  await votesCollection.createIndex({ email: 1 }, { unique: true });

  // Routes
//   app.use("/api/vote", voteRoutes(votesCollection));
app.use("/api/vote", voteRoutes(votesCollection, requireAdmin, allowRoles));
  
  // ⏬ ADD THIS LINE TO MOUNT YOUR CONTESTANTS ROUTE
  app.use("/api/contestants", contestantsRoutes(contestantsCollection));

  app.use("/api/artist/register", artistRegisterRoutes(artistsCollection));
  app.use("/api/artist/checkin", artistCheckinRoutes(artistsCollection)); 
  app.use("/api/artist/get", getArtistRoutes(artistsCollection));
  app.use("/api/artist/all", getAllArtistsRoutes(artistsCollection));

  app.use("/api/public-gallery", getGalleryArtistsRoutes(galleryArtistsCollection));

  app.use("/api/volunteer/register", volunteerRegisterRoutes(volunteersCollection));
  app.use("/api/volunteer/checkin", volunteerCheckinRoutes(volunteersCollection));
  app.use("/api/volunteer/get", getVolunteerRoutes(volunteersCollection));
  app.use("/api/volunteer/all", getAllVolunteersRoutes(volunteersCollection));

  app.use("/api/admin/auth", adminAuthRoutes(adminsCollection));

 app.use("/api/pageant/register", pageantRegisterRoutes(pageantlistCollection));
app.use("/api/pageant/get", getPageantContestantRoutes(pageantlistCollection));
app.use("/api/pageant/checkin", pageantCheckinRoutes(pageantlistCollection));
app.use("/api/vendor-feedback", vendorFeedbackRoutes(vendorFeedbackCollection));
app.use("/api/artist-feedback", artistFeedbackRoutes(artistFeedbackCollection));



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
    allowRoles("full", "artist", "volunteer","pageant"),
    (req, res) => {
      res.json({ success: true, message: "Admin dashboard access granted" });
    }
  );

//   app.use(
//     "/api/admin/pageant-checked-in", // Clean admin-spaced path
//     requireAdmin,
//     allowRoles("full", "pageant", "volunteer"), // Define who can view this data
//     getAllPageantCheckedInRoutes(pageantlistCollection)
//   );

  app.use(
    "/api/admin/pageant",
    requireAdmin,
    allowRoles("full", "pageant"),
    adminPageantRoutes(pageantlistCollection)
  );

  app.use(
  "/api/admin/vendor-feedback",
  requireAdmin,
  allowRoles("full"),
  adminVendorFeedbackRoutes(vendorFeedbackCollection)
);

app.use(
  "/api/admin/artist-feedback",
  requireAdmin,
  allowRoles("full"),
  adminArtistFeedbackRoutes(artistFeedbackCollection)
);



  // Start server
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
}

startServer();