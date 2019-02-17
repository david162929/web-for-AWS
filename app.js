const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

//use bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set pug
app.set("view engine", "pug");


app.get("/",(req, res) => {
	res.render("index.pug");
});

app.get("/admin/product.html",(req, res) => {
	res.render("product.pug");
});

app.get("/admin/campaign.html",(req, res) => {
	res.render("campaign");
});

app.get("/admin/checkout.html",(req, res) => {
	res.render("checkout");
});





app.listen(3000, () => {
	console.log("this app is running on port 3000.");
});