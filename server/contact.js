import express from "express";
import sql from "./db.js";
import { requireAuth } from "./middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Name, email, and message are required" });
        }

        await sql`
            INSERT INTO messages (name, email, subject, message)
            VALUES (${name}, ${email}, ${subject || ""}, ${message})
        `;

        res.json({ success: true, message: "Your message has been sent successfully!" });
    } catch (err) {
        console.error("Message submission failed:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/", requireAuth, async (req, res) => {
    try {
        const messages = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

router.delete("/:id", requireAuth, async (req, res) => {
    try {
        await sql`DELETE FROM messages WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

export default router;
