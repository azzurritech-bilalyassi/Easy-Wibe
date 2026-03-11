const Event = require("../models/Event");
const Favorite = require("../models/Favorite");

// Toggle favorite (add/remove)
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    console.log(userId, eventId, "userId,eventId");

    const existing = await Favorite.findOne({ userId, eventId });

    if (existing) {
      // Remove favorite
      await Favorite.deleteOne({ userId, eventId });
      await Event.findByIdAndUpdate(eventId, { $inc: { totalFavorites: -1 } });
      return res.json({
        message: "Removed from favorites",
      });
    } else {
      // Add favorite
      await Favorite.create({ userId, eventId });
      await Event.findByIdAndUpdate(eventId, { $inc: { totalFavorites: 1 } });
      return res.json({
        message: "Added to favorites",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get only user favorite events
const getUserFavoriteEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId }).select("eventId");
    const favoriteEventIds = favorites.map((f) => f.eventId);

    if (!favoriteEventIds.length) return res.json([]);

    const events = await Event.find({ _id: { $in: favoriteEventIds } }).lean();

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Export both functions as CommonJS module
module.exports = { toggleFavorite, getUserFavoriteEvents };
