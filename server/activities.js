import express from "express";
import sql from "./db.js";
import { requireAuth } from "./middleware/auth.js";

const router = express.Router();

// GET: Fetch all activities (public — shown on the portfolio page)
router.get("/", async (req, res) => {
    try {
        const activities = await sql`SELECT * FROM activities ORDER BY display_order ASC, id ASC`;
        res.json({ success: true, data: activities });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// POST: Add new activity (admin only)
router.post("/", requireAuth, async (req, res) => {
    try {
        const { label, title, description, status, link_url, display_order } = req.body;
        await sql`
            INSERT INTO activities (label, title, description, status, link_url, display_order)
            VALUES (${label || ""}, ${title}, ${description || ""}, ${status || "pending"}, ${link_url || ""}, ${display_order || 0})
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT: Edit existing activity (admin only)
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const { label, title, description, status, link_url, display_order } = req.body;
        await sql`
            UPDATE activities
            SET label = ${label || ""}, title = ${title}, description = ${description || ""},
                status = ${status || "pending"}, link_url = ${link_url || ""}, display_order = ${display_order || 0}
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
        await sql`DELETE FROM activities WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
