const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

//use bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set pug
app.set("view engine", "pug");

//mysql module
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "52.15.89.192",
  user: "ec2-user",
  password: "123qweasdzxc",
  database: "assignment"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

/*   con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) throw err;
	console.log(result);
  });  */
    
});





//Route
app.get("/",(req, res) => {
	res.render("index.pug");
});

app.get("/admin/product.html",(req, res) => {
	res.render("product.pug");
});

//Poduct API 1.0
app.post("/api/1.0/admin/product", (req, res) => {
	const id = req.body.id;
	const title = req.body.title;
	const description = req.body.description;
	const price = req.body.price;
	const texture = req.body.texture;
	const wash = req.body.wash;
	const place = req.body.place;
	const note = req.body.note;
	const story = req.body.story;
	
	
	console.log(id, title, description, price, texture, wash, place, note, story);
	res.redirect("/admin/product.html");
	
});




app.get("/admin/campaign.html",(req, res) => {
	res.render("campaign");
});

app.get("/admin/checkout.html",(req, res) => {
	res.render("checkout");
});




//Port
app.listen(3000, () => {
	console.log("this app is running on port 3000.");
});