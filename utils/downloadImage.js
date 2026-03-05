const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadImage = async (url) => {
  const fileName = `google_${Date.now()}.jpg`;
  const filePath = path.join("uploads", fileName);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
};

module.exports = downloadImage;
