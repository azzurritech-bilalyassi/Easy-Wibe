const Event = require("../models/Event");

// 🧑‍💼 CREATE EVENT (Draft by default)
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📝 UPDATE EVENT (draft edit)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// 📋 ADMIN GET ALL EVENTS
const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
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
  getAdminEvents,
  getPublishedEvents,
};
