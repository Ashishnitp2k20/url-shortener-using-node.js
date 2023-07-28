const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();
  const user = req.user;

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
    // ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
  });

  return res.render('shortLink', {
    id: shortID,
    username: user.name,    
    });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
    username: req.user.name,
    shortId: shortId,
    url: result.redirectURL,
    ip: req.headers["x-forwarded-for"],
    remoteAddress: req.connection.remoteAddress,
    createdBy: req.user._id,
    created: result.createdAt.toLocaleString(
      "en-US",
      { timeZone: "Asia/Kolkata" }
    )
  });
}

// delete analytics from analytics  collection
// function handleDeleteAnalytics(req, res) {
//   const shortId = req.params.shortId;
//   const result = await URL.findOneAndDelete({ shortId });
//   return res.json({
//     totalClicks: result.visitHistory.length,
//     analytics: result.visitHistory,
//   });

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
