// --- SERVER START / VERCEL EXPORT ---
if (process.env.NODE_ENV !== 'production') {
    // This runs on your local computer
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// This is strictly for Vercel
module.exports = app;