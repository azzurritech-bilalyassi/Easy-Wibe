const moodMap = require("../constants/moodMap");
const alterEgoMap = require("../constants/alterEgoMap");
const User = require("../models/User");

const getAllMoods = (req, res) => {
  try {
    const allMoods = Object.keys(moodMap).map((key) => ({
      alterEgo: key,
      title: alterEgoMap[key].title,
      image: alterEgoMap[key].image,
      description: alterEgoMap[key].description,
      moods: moodMap[key],
    }));

    res.json(allMoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const saveUserMoods = async (req, res) => {
  try {
    const userId = req.user.id;
    const { alterEgo } = req.body;

    const moods = moodMap[alterEgo];

    if (!moods) {
      return res.status(400).json({
        message: "Invalid alter ego",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        moods,
      },
      { new: true },
    );

    res.json({
      success: true,
      messages: "User mood save",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllMoods, saveUserMoods };
