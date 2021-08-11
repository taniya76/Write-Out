//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");


const homeStartingContent = "This app can be your friend, here you can add your Daily posts";
const contactContent = "Thermal deductible until the price vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Inspections Ut et drink recipes. Minneapolis developer undergraduate homework et. Laughter pull undergraduate at iaculis in the region. Nor do some shooting movies malesuada bibendum sapien arcu vitae. Recipe sometimes varied mainstream real estate. But now targeted propaganda opportunities. Sometimes put lorem ipsum carrots undergraduate tomato soup. The cushion element of the whole, they shall neither. Basketball was pregnant dark to invest clinical zero. So that the disease in the aliquam sem mauris fringilla tincidunt. Set the temperature to photography always pull for free.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-taniya:SrvNiya767@cluster0.z8u2a.mongodb.net/blogDB", { useUnifiedTopology: true, useNewUrlParser: true });

//creating schema for db
const postSchema = {
  title: String,
  content: String
};
// creating model 
const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});
app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.post("/contact",function(req,res){
    console.log(req.body.contact_mail,req.body.contact_message);
    res.redirect("/contact");
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;

  Post.findOne({ _id: requestedId }, function (err, post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
