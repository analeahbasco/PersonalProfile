import express from "express";
import sql from "./db.js";
import { requireAuth } from "./middleware/auth.js";

const router = express.Router();

// GET: Fetch all skills (public — shown on the portfolio page)
router.get("/", async (req, res) => {
    try {
        const skills = await sql`SELECT * FROM skills ORDER BY display_order ASC, id ASC`;
        res.json({ success: true, data: skills });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// POST: Add new skill (admin only)
router.post("/", requireAuth, async (req, res) => {
    try {
        const { name, level, display_order } = req.body;
        await sql`
            INSERT INTO skills (name, level, display_order)
            VALUES (${name}, ${level || ""}, ${display_order || 0})
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT: Edit existing skill (admin only)
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const { name, level, display_order } = req.body;
        await sql`
            UPDATE skills
            SET name = ${name}, level = ${level || ""}, display_order = ${display_order || 0}
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
        await sql`DELETE FROM skills WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
