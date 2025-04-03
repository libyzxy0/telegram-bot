import express from "express";

const app = express();

app.get("/", (_req, res) => {
    res.send("Telegram Bot by @libyzyx0");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log("App is listening of on fucking port: " + PORT)
);