const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    location: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    totalFavorites: {
      type: Number,
      default: 0,
    },

    moodCategory: {
      type: String,
      required: true,
      enum: ["Happy", "Party", "Chill", "Romantic"],
    },
    companyTags: {
      type: String,
      required: true,
      enum: ["Alone", "Friends"],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    isFavorite: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      value: {
        type: Boolean,
        default: false,
      },
    },

    eventDate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
