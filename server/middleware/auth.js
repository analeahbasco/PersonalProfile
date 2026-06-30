import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const COOKIE_NAME = "admin_token";

export function signAdminToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
}

export function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.VERCEL ? true : false,
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });
}

export function clearAuthCookie(res) {
    res.clearCookie(COOKIE_NAME);
}

// Protects JSON API routes (POST/PUT/DELETE on certificates, gallery, etc.)
export function requireAuth(req, res, next) {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Session expired, please log in again" });
    }
}

// Protects server-rendered admin HTML pages — redirects to login instead of returning JSON
export function requireAuthPage(req, res, next) {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
        return res.redirect("/admin/login");
    }
    try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.redirect("/admin/login");
    }
}

export { COOKIE_NAME };
