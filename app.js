//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
// "use strict";
const nodemailer = require("nodemailer");


const homeStartingContent = "This app can be your friend, here you can add your Daily posts";
const contactContent = "Thermal deductible until the price vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Inspections Ut et drink recipes. Minneapolis developer undergraduate homework et. Laughter pull undergraduate at iaculis in the region. Nor do some shooting movies malesuada bibendum sapien arcu vitae. Recipe sometimes varied mainstream real estate. But now targeted propaganda opportunities. Sometimes put lorem ipsum carrots undergraduate tomato soup. The cushion element of the whole, they shall neither. Basketball was pregnant dark to invest clinical zero. So that the disease in the aliquam sem mauris fringilla tincidunt. Set the temperature to photography always pull for free.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-taniya:SrvNiya767@cluster0.z8u2a.mongodb.net/blogDB", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

//creating schema for db
const postSchema = {
  title: String,
  content: String
}
// creating model 
const Post = mongoose.model("Post", postSchema);

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'www.taniyamittalhgn@gmail.com',
    pass: 'SrvNiya67#'
  }
});
// async..await is not allowed in global scope, must use a wrapper
async function sent_mail(contact_name, contact_mail, query_subject, contact_message) {

  var mailOptions = {
    from: `"User" <${contact_name}>`, // sender Name
    to: 'taniyamittalhgn@gmail.com', // list of receivers
    subject: `${query_subject}`,
    template: 'email',
    text: `Sender of the mail is ${contact_mail}
    ${contact_message}`

  };

  // trigger the sending of the E-mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}


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

app.post("/contact", function (req, res) {
  // console.log(req.body.contact_name,req.body.contact_mail,req.body.query_subject, req.body.contact_message);
  sent_mail(req.body.contact_name, req.body.contact_mail, req.body.query_subject, req.body.contact_message);
  res.redirect("/contact");
});

app.get("/compose", function (req, res) {
  res.render("compose", { Title: "", Body: "", id: "" });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  const postID = req.body.postID;
  console.log(postID)
  if (postID == "") {
    post.save(function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    Post.findByIdAndUpdate(postID, { title: req.body.postTitle, content: req.body.postBody }, function (err) {
      if (!err) {
        console.log("Successfully updated.");
        res.redirect("/posts/" + postID);
      }
    });
  }
});

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;

  Post.findOne({ _id: requestedId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      id: post._id
    });
  });
});

app.post("/delete", function (req, res) {
  const deletePostId = req.body.deleteButton;
  console.log(deletePostId);

  Post.findByIdAndRemove(deletePostId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
});


app.post("/update", function (req, res) {
  const updatePostId = req.body.updateButton;
  console.log(updatePostId);
  Post.findOne({ _id: updatePostId }, function (err, post) {
    res.render("compose", {
      Title: post.title,
      Body: post.content,
      id: post._id
    });
  });
  // res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
