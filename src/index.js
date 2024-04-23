require("dotenv").config();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
//const webRoute = require("./routes/web");
const cors = require("cors");
//const apiRoute = require("./routes/api");
const cookieParser = require("cookie-parser");
const configViewEngine = require("./config/viewEngine");
const session = require("express-session");
const flash = require("express-flash");
const useRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

configViewEngine(app);

app.use(express.static(__dirname + "/public"));

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  let carts = req.session.cart;
  let total = 0;
  let sum = 0;
  for (let i = 0; i < carts.length; i++) {
    sum = carts[i].price * carts[i].quantity;
    total += sum;
  }
  res.locals.cart = req.session.cart;
  res.locals.total = total;
  next();
});
app.use((req, res, next) => {
  if (
    !req.cookies.UserId ||
    !req.cookies.name ||
    !req.cookies.username ||
    !req.cookies.email ||
    !req.cookies.address
  ) {
    res.locals.UserId = "";
    res.locals.name = "";
    res.locals.username = "";
    res.locals.email = "";
    res.locals.address = "";
  }
  if (
    !req.cookies.adminUserId ||
    !req.cookies.adminname ||
    !req.cookies.adminusername ||
    !req.cookies.adminemail ||
    !req.cookies.adminaddress
  ) {
    res.locals.adminUserId = "";
    res.locals.adminname = "";
    res.locals.adminusername = "";
    res.locals.adminemail = "";
    res.locals.adminaddress = "";
  }

  if (!req.cookies.categories) {
    res.locals.categories = "";
  }

  if (!req.cookies.cartTotal) {
    res.locals.cartTotal = "";
  }

  res.locals.categories = req.cookies.categories;
  res.locals.cartTotal = req.cookies.cartTotal;

  res.locals.token = req.cookies.token;
  res.locals.userId = req.cookies.userId;
  res.locals.name = req.cookies.name;
  res.locals.userName = req.cookies.userName;
  res.locals.email = req.cookies.email;
  res.locals.address = req.cookies.address;

  //admin
  res.locals.adminUserId = req.cookies.adminUserId;
  res.locals.adminname = req.cookies.adminname;
  res.locals.adminUserName = req.cookies.adminUserName;
  res.locals.adminemail = req.cookies.adminemail;
  res.locals.adminaddress = req.cookies.adminaddress;
  next();
});

// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.CALL_BACK_FB,
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        const { name, emails, id } = profile;
        const user = {
          //email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          id: id,
        };
        const payload = {
          user,
          accessToken,
        };
        return done(null, payload);
      });
    }
  )
);

//Use "GoogleStrategy" as the Authentication Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.CALL_BACK_GG,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      const { emails, photos, id } = profile;
      //console.log(profile);
      const user = {
        email: emails[0].value,
        picture: photos[0].value,
        id: id,
        accessToken,
      };
      //console.log(user);
      return done(null, user);
    }
  )
);

// app.use("/", webRoute);
// app.use("/api/v1/", apiRoute);
app.use("/", useRouter);
app.use("/", adminRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
