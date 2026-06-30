import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import certificatesRouter from "./certificates.js";
import galleryRouter from "./gallery.js";
import adminRouter from "./admin.js";
import contactRouter from "./contact.js";
import { requireAuthPage, clearAuthCookie } from "./middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve static assets
app.use("/admin", express.static(path.join(__dirname, "../client/admin")));
app.use("/assets", express.static(path.join(__dirname, "../client/assets")));
app.use(express.static(path.join(__dirname, "../client")));

// API routes
app.use("/api/certificates", certificatesRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);

// Public admin login page
app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/login.html"));
});

// Protected admin pages (clean, extensionless URLs)
app.get("/admin/dashboard", requireAuthPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/dashboard.html"));
});

app.get("/admin/gallery", requireAuthPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/gallery.html"));
});

app.get("/admin/certificates", requireAuthPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/certificates.html"));
});

app.get("/admin/messages", requireAuthPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin/message.html"));
});

app.get("/admin/logout", (req, res) => {
    clearAuthCookie(res);
    res.redirect("/admin/login");
});

// Run a local listener only outside of Vercel's serverless runtime
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Workspace server running at http://localhost:${PORT}`));

    if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
export default app;
}