const { getHeight } = require("jimp");
var Jimp = require("jimp");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 4000;

var corsOptions = {
  origin: /http:\/\/localhost:\d+/gm,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const processImage = async (url) => {
  try {
    const width = 64;
    const height = 64;
    const imgageURL =
      url ||
      "https://media-exp1.licdn.com/dms/image/C4D03AQHcdFF4raUvmg/profile-displayphoto-shrink_800_800/0/1517049379038?e=1652918400&v=beta&t=eqvLREjFV6YTpEbq5uQCvBNFdtvEjtho9imVL9gx0wk";
    const image = await Jimp.read(imgageURL);

    image.resize(width, height);

    const matrix = [];

    for (let h = 0; h <= height; h++) {
      matrix[h] = [];
      for (let w = 0; w <= width; w++) {
        matrix[h][w] = Jimp.intToRGBA(image.getPixelColor(w, h));
      }
    }
    console.log("Image processed");
    return { matrix };
  } catch (error) {
    console.log({ error: error.message });
    return { error: error.message };
  }
};

const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors(corsOptions));

app.post("/", [cors(), jsonParser, urlencodedParser], async (req, res) => {
  console.log("Processing request:", req.body);
  res.send(await processImage(req.body.imageURL));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
