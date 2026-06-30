import express from "express";
import sql from "./db.js";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { requireAuth } from "./middleware/auth.js";

const router = express.Router();

// 1. Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "certificates", // folder name inside your Cloudinary dashboard
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage: storage });

// GET: Fetch all entries (public — shown on the portfolio page)
router.get("/", async (req, res) => {
    try {
        const certificates = await sql`SELECT * FROM certificates ORDER BY date_earned DESC`;
        res.json({ success: true, data: certificates });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// POST: Add new certificate (admin only)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
    try {
        const { title, issuer, date_earned, description } = req.body;
        const image_url = req.file ? req.file.path : "";

        await sql`
            INSERT INTO certificates (title, issuer, date_earned, image_url, description)
            VALUES (${title}, ${issuer}, ${date_earned}, ${image_url}, ${description || ""})
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT: Edit existing certificate (admin only)
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
        const { title, issuer, date_earned, description } = req.body;
        let image_url = req.file ? req.file.path : req.body.image_url;

        await sql`
            UPDATE certificates
            SET title = ${title}, issuer = ${issuer}, date_earned = ${date_earned}, image_url = ${image_url}, description = ${description || ""}
            WHERE id = ${req.params.id}
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE: Remove by ID (admin only)
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        await sql`DELETE FROM certificates WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
