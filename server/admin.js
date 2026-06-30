import express from "express";
import bcrypt from "bcrypt";
import sql from "./db.js";
import { signAdminToken, setAuthCookie, clearAuthCookie, requireAuth } from "./middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }

        const rows = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = signAdminToken({ id: user.id, username: user.username });
        setAuthCookie(res, token);

        res.json({ success: true, message: "Login successful" });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/logout", (req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
});

router.get("/me", requireAuth, (req, res) => {
    res.json({ success: true, admin: req.admin });
});

router.get("/stats", requireAuth, async (req, res) => {
    try {
        const [certs] = await sql`SELECT COUNT(*)::int AS count FROM certificates`;
        const [gallery] = await sql`SELECT COUNT(*)::int AS count FROM gallery`;
        const [skills] = await sql`SELECT COUNT(*)::int AS count FROM skills`;
        const [activities] = await sql`SELECT COUNT(*)::int AS count FROM activities`;
        const [messages] = await sql`SELECT COUNT(*)::int AS count FROM messages`;

        res.json({
            success: true,
            data: {
                certificates: certs.count,
                gallery: gallery.count,
                skills: skills.count,
                activities: activities.count,
                messages: messages.count,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

export default router;
