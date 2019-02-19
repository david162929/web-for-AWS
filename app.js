const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' })		//upload path

const app = express();

//use bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set pug
app.set("view engine", "pug");

//static files
app.use("/static", express.static("public"));

//multer set storing files
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
});
var upload = multer({ storage: storage });


//mysql module(移到伺服器之前要做修改)
var mysql = require('mysql2');
var Client = require('ssh2').Client;
var sql;

var ssh = new Client();
ssh.on('ready', function() {
	ssh.forwardOut(
		'127.0.0.1',
		12345,
		'127.0.0.1',
		3306,
		function (err, stream) {
			if (err) throw err;
			sql = mysql.createConnection({
				user: 'root',
				database: 'stylish',
				password: 'daviddata1357',
				stream: stream // <--- this is the important part
			});
			// use sql connection as usual
			sql.query("SELECT * FROM product", function (err, result, fields) {
				if (err) throw err;
				//console.log(result);
			});
	  
		});
	}).connect({
	// ssh connection config ...
	host: '52.15.89.192',
	port: 22,
	username: 'ec2-user',
	privateKey: require('fs').readFileSync("/.ssh/2019-2-14-keyPair.pem")
}); 


/* //mysql module
var mysql = require('mysql');

var sql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "daviddata1357",
  database: "stylish"
});

sql.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
    
}); */




//Route
app.get("/",(req, res) => {
	res.render("index.pug");
});

app.get("/admin/product.html",(req, res) => {

	res.render("product.pug");
});

//Poduct API 1.0
app.post('/profile', upload.single('test'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  	const file = req.file;
	
	//file.filename = file.orignalname;
	
	console.log(file);
	console.log(file.mimetype);
	console.log(file.fieldname);
	console.log(file.originalname);
	console.log(file.size);
	console.log(file.path);
	res.redirect("/admin/product.html");
})
app.post('/photos/upload', upload.array('test2', 20), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
	const files = req.files;
	
	console.log(files);

	res.redirect("/admin/product.html");
})
app.post("/img-upload", upload.fields([{name: "test3", maxCount: 1}, {name: "test4", maxCount: 50}]), (req, res, next) => {
	
	console.log(req.files);
	
	res.redirect("/admin/product.html");
});




app.post("/api/1.0/admin/product", (req, res) => {
	const productId = req.body.productId;
	const title = req.body.title;
	const description = req.body.description;
	const price = req.body.price;
	const texture = req.body.texture;
	const wash = req.body.wash;
	const place = req.body.place;
	const note = req.body.note;
	const story = req.body.story;
	const colorCodes = req.body.colorCodes;
	const colorNames = req.body.colorNames;	
	const sizes = req.body.sizes;
	
	//Insert table product
	sql.query(`INSERT INTO product (product_id, title, description, price, texture, wash, place, note, story, color_codes, color_names, sizes) VALUES ('${productId}', '${title}', "${description}", "${price}", "${texture}", "${wash}", "${place}", "${note}", "${story}", "${colorCodes}", "${colorNames}", "${sizes}")`, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
	});
	
	//Insert table variants
	let productType = 1;

	const arrayOfColorCodes = colorCodes.split(",");
	const arrayOfColorNames = colorNames.split(",");
	const arrayOfSizes = sizes.split(",");

	if (arrayOfColorCodes.length != arrayOfColorNames.length){
		console.log("color_codes != color_names.");
	}
	else {
		for (let i=0 ; i < arrayOfColorCodes.length ; i++){
			for (let x=0 ; x < arrayOfSizes.length ; x++) {
				console.log(arrayOfColorCodes[i], arrayOfSizes[x], productType);
				
				sql.query(`INSERT INTO variants (product_id, product_type, color_code, color_name, size, variant_price, stock) VALUES ("${productId}", "${productType}", "${arrayOfColorCodes[i]}", "${arrayOfColorNames[i]}", "${arrayOfSizes[x]}", "${price}", "0")`, function (err, result) {
					if (err) throw err;
					console.log("1 record inserted");
				});
				
				productType += 1;
			}
		
		};
	}
	
	
	
	console.log(req.body);
	
		
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