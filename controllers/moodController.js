const moodMap = require("../constants/moodMap");
const alterEgoMap = require("../constants/alterEgoMap");

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

module.exports = { getAllMoods };
