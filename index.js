var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");

const localStrategy = require("passport-local");
const posts = require("./posts");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/feed", function (req, res) {
  res.render("feed");
});

router.post( "/upload",isLoggedIn,upload.single("file"),async function (req, res) {
    if (!req.file) {
      return res.status(404).send("no files were uploaded.");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const postdata = await postModel.create({
      image: req.file.filename,
      postText: req.body.filecaption,
      user: user._id,
    });
    user.posts.push(postdata);
    await user.save();
    res.redirect("/profile");
  }
);

router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user
    })
    .populate("posts")
  // console.log(user);
  res.render("profile", { user });
});

router.post("/register", function (req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });
  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// router.get("/alluserpost", async function (req, res) {
//   let user = await userModel
//     .findOne({ _id: "65fb49136f51a368fdeacdb4" })
//     .populate("posts");
//   res.send(user);
// });

// router.get("/createuser", async function (req, res) {
//   let createduser = await userModel.create({
//     username: "rishi",
//     password: "rishu@1234",
//     email: "rishu@123456",
//     post: [],
//     fullName: "Rimanshu bisen",
//   });
//   res.send(createduser);
// });

// router.get("/createpost", async function (req, res) {
//   let createdpost = await postModel.create({
//     postText: "hello boys kese ho",
//     user: "65fb49136f51a368fdeacdb4",
//   });

//   let user = await userModel.findOne({
//     _id: "65fb49136f51a368fdeacdb4",
//   });
//   user.posts.push(createdpost._id);
//   res.send(createdpost);
//   await user.save();
//   res.send("problem solve");
// });

module.exports = router;
