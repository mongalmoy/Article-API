const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});


const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);


/////////////////////////////// Request Targetting A Specific Article///////////////////////////////////////

app.route('/articles')
    .get(function(req, res){
        Article.find({}, function(err, foundArticles){
            res.send(foundArticles);
        });
    })
    .get()
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save();
    })
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if(!err){
                console.log("Successfully deleted all articles.");
            } else {
                console.log(err);
            }
        });
    })


/////////////////////////////// Request Targetting A Specific Article///////////////////////////////////////

app.route('/articles/:articleTitle')
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No article matching that title was found.");

            }
        });
    })
    .put(function(req, res){
        Article.update(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content}, 
            function(err){
                if(!err){
                    console.log("Successfully updated article.");
                } else {
                    console.log(err);
                    res.send(err);
                }
            }
        );
    })
    .patch(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated article.");
                } else {
                    console.log(err);
                    res.send(err);
                }
            }
        );
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted requested article.");
                } else {
                    console.log(err);
                    res.send(err);
                }
            }
        );
    });


app.listen(3000, function(){
    console.log("Server started on port 3000");
});