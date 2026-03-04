const Event = require("../models/Event");

// 🧑‍💼 CREATE EVENT (Draft by default)
const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create events" });
    }

    const {
      title,
      description,
      location,
      price,
      moodCategory,
      companyTags,
      eventDate,
      image,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      price,
      moodCategory,
      companyTags,
      eventDate,
      image,
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📝 UPDATE EVENT (draft edit)
const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update events" });
    }

    const { eventId } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      event.isFavorite.userId &&
      event.isFavorite.userId.toString() === userId
    ) {
      event.isFavorite = { userId: null, value: false };
      event.totalFavorites = Math.max(0, event.totalFavorites - 1);
    } else {
      event.isFavorite = { userId, value: true };
      event.totalFavorites += 1;
    }

    await event.save();
    res.status(200).json({
      message: "Favorite status updated",
      isFavorite: event.isFavorite,
      totalFavorites: event.totalFavorites,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🚀 PUBLISH EVENT
const publishEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true },
    );

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📱 USER APP — GET PUBLISHED EVENTS ONLY
const getPublishedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "published" }).sort({
      createdAt: -1,
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  publishEvent,
  getPublishedEvents,
  getAllEvents,
  toggleFavorite,
};
