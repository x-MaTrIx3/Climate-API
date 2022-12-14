const PORT = 6969;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");

const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "cityam",
    address: "https://www.cityam.com/topic/environment",
    base: "",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    base: "https://www.nytimes.com",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment",
    base: "",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "nyp",
    address: "https://nypost.com/tag/climate-change",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspapers) => {
  axios.get(newspapers.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspapers.base + url,
        source: newspapers.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Weclome to my testing API");
});

app.get("/API", (req, res) => {
  res.json(articles);
});

app.get("/API/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspapers) => newspapers.name == newspaperId
  )[0].address;
  const newspapersBase = newspapers.filter(
    (newspapers) => newspapers.name == newspaperId
  )[0].base;
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("Climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspapersBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});
app.listen(PORT, () => console.log("Server is runnig on Port " + PORT + "!"));
