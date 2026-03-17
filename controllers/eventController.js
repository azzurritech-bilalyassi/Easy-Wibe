const Event = require("../models/Event");
const Notification = require("../models/Notification");
const User = require("../models/User");
const paginatedResponse = require("../utils/paginatedResponse");
const getPagination = require("../utils/pagination");
const sendPushNotification = require("../utils/sendPushNotification");

// 🧑‍💼 CREATE EVENT (Draft by default)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      moodCategory,
      companyTags,
      eventDate,
    } = req.body;

    // if (!req.file) {
    //   return res.status(400).json({ message: "Event image is required" });
    // }

    const event = await Event.create({
      title,
      description,
      location,
      price,
      moodCategory,
      companyTags,
      eventDate,
      // image: req.file.path,
    });

    // const users = await User.find({
    //   moods: event.moodCategory,
    //   deviceToken: { $ne: null },
    // });

    const users = await User.find({
      deviceToken: { $ne: null },
    });

    for (const user of users) {
      // save notification in DB
      await Notification.create({
        userId: user._id,
        title: "New Event For You",
        message: `${event.title} is available now`,
        eventId: event._id,
      });

      // send push notification
      const result = await sendPushNotification(
        user.deviceToken,
        "New Event For You",
        `${event.title} is available now`,
      );

      if (result.success) {
        console.log("Notification sent to:", user._id);
      }
    }

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
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

    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.file) {
      event.image = req.file.path;
    }

    const updatedEvent = await event.save();

    res.json({ message: "Event updated successfully", updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const search = req.query.search || "";

    const query = {
      title: { $regex: search, $options: "i" },
    };

    const events = await Event.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ eventDate: -1 });
    const total = await Event.countDocuments(query);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json(paginatedResponse(events, total, page, limit));
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const toggleFavorite = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     const userId = req.user.id;

//     if (!event) return res.status(404).json({ message: "Event not found" });

//     const index = event.favorites.indexOf(userId);

//     if (index === -1) {
//       event.favorites.push(userId);
//     } else {
//       event.favorites.splice(index, 1);
//     }

//     event.totalFavorites = event.favorites.length;

//     await event.save();

//     res.json({
//       message: "Favorite updated",
//       totalFavorites: event.totalFavorites,
//       isFavorite: event.favorites.includes(userId),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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
    let filter = { status: "published" };

    if (req.user) {
      const user = await User.findById(req.user.id);

      if (user && user.moods?.length) {
        filter.moodCategory = { $in: user.moods };
      }
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Event.distinct("location", {
      status: "published",
    });

    res.status(200).json({
      locations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  getPublishedEvents,
  getAllEvents,
  // toggleFavorite,
  getAllLocations,
};
