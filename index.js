const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const ejs = require('ejs');
const cookieParser = require("cookie-parser");
const { checkForAuthentication, restrictToWhom } = require('./middleware/auth');
const app = express();
const PORT = 1337;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, './views'));
// app.set("partials", path.resolve(__dirname, '../views/partials'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication );



app.use("/url", restrictToWhom(['NORMAL','ADMIN']), urlRoute);
app.use('/user', userRoute);
app.use('/',  staticRoute);

app.use('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});


app.get("/url/:shortId",  async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

// const partialsPath = path.join(__dirname, './views/partials');
// app.use(express.static(partialsPath));
// ejs.registerPartials(partialsPath);
// app.get("/details", async (req, res) => {
//   const entries = await URL.find({});
//   res.render('details', { entries });
// });


app.get("*", async (req, res) => {
  res.render("errorPage");
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));