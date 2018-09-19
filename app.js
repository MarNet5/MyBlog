var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose   = require("mongoose"),
express    = require("express"),
app        = express();

//APP CONFIG

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public")); //serve our custom stylesheet, public is a directory
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //USE AFTER BODY_PARSER!
app.use(methodOverride("_method"));

//MONGOOSE MODEL/CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


//RESTful ROUTES
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

//INDEX ROUTE

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){ //pass the data coming back from the DB from .find whatever comes back
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs});  //render index with data "blogs"
       }
   });
});



//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
    console.log("============")
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
         res.render("edit", {blog: foundBlog});   
        }
    })
});
   
//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
             //redirect somewhere
            res.redirect("/blogs");
        }
    })
   
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!")
});
