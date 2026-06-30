import express from "express";
import sql from "./db.js";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { requireAuth } from "./middleware/auth.js";

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "gallery",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage: storage });

// GET: Fetch all gallery items (public — shown on the portfolio page)
router.get("/", async (req, res) => {
    try {
        const items = await sql`SELECT * FROM gallery ORDER BY date_completed DESC`;
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// POST: Add new gallery item (admin only)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
    try {
        const { title, category, date_completed, description } = req.body;
        const image_url = req.file ? req.file.path : "";

        await sql`
            INSERT INTO gallery (title, category, date_completed, image_url, description)
            VALUES (${title}, ${category}, ${date_completed}, ${image_url}, ${description || ""})
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT: Edit existing gallery item (admin only)
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
        const { title, category, date_completed, description } = req.body;
        let image_url = req.file ? req.file.path : req.body.image_url;

        await sql`
            UPDATE gallery
            SET title = ${title}, category = ${category}, date_completed = ${date_completed}, image_url = ${image_url}, description = ${description || ""}
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
        await sql`DELETE FROM gallery WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
