/* ---------------Module--------------- */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer  = require('multer');
const mysql = require('mysql2');
const Client = require('ssh2').Client;
const request = require("request");
const crypto = require('crypto');
const fs = require('fs');
const NodeCache = require( "node-cache" );
const AWS = require('aws-sdk');
const uuid = require('uuid');

const app = express();

//Initialize node-cache
const myCache = new NodeCache();

//use bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());								//receive POST request JOSN req.body
app.use(cookieParser());

//set pug
app.set("view engine", "pug");

//static files
app.use("/static", express.static("public"));

/* //multer set storing files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
});
const upload = multer({ storage: storage }); */

//multer set storing files in memory
const storage = multer.memoryStorage() // memoryStorage() is not a function
var upload = multer({ storage: storage });





//create TCP connection to MySQL over SSH by using mysql2 and ssh2 module
let pool;	//can't use const

const ssh = new Client();
ssh.on('ready', function() {
	ssh.forwardOut(
		'127.0.0.1',
		12345,
		'127.0.0.1',
		3306,
		function (err, stream) {
			if (err) throw err;
			// Create the connection pool. The pool-specific settings are the defaults
			pool = mysql.createPool({
			  user: 'root',
			  database: 'stylish',
			  password: 'daviddata1357',
			  stream: stream,
			  waitForConnections: true,
			  connectionLimit: 10,
			  queueLimit: 0
			});		
			
/* 			sql = mysql.createConnection({
				user: 'root',
				database: 'stylish',
				password: 'daviddata1357',
				stream: stream // <--- this is the important part
			}); */
			
			// use sql connection as usual
			pool.query("SELECT id FROM product", function (err, result, fields) {
				if (err) throw err;
				console.log("Connect to MySQL succeed!");
			});
	
		});
	}).connect({
	// ssh connection config ...
	host: '52.15.89.192',
	port: 22,
	username: 'ec2-user',
	privateKey: require('fs').readFileSync(".ssh/2019-2-14-keyPair.pem")
}); 



/* ---------------Route--------------- */
app.get("/", async (req, res) => {
	//get product info
	let startId = 47;
	let result2 = await sqlQuery(`SELECT * FROM product WHERE id IN (47,48,49,50,51,52)`);
	let arrayAll = [];
	for (let i=0; i<6; i++) {
		arrayAll.push(`product.html?id=${startId+i}`);
		// /product.html?id=47
		
		arrayAll.push(result2[i].main_image_path);
		let colorOne = result2[i].color_codes;
		colorOne = colorOne.replace(/,/g, "'></div><div class='square ");
		colorOne = "<div class='square " + colorOne + "'></div>";
		arrayAll.push(colorOne);
		arrayAll.push(result2[i].title);
		arrayAll.push(result2[i].price);
	}

	//create object to set variable in pug
	objectFin = {};
	for (let i=0; i<arrayAll.length; i++) {
		objectFin[`arrayAll${i}`] = arrayAll[i];
	}

	
	//get campaign info
	let result1 = await sqlQuery(`SELECT * FROM campaigns WHERE campaigns_id IN (6,7,8)`);
	result1 = result1[0].story;
	result1 = result1.replace(/ /g, "<br>");
	result1 = "<h2>" + result1 + "<h2>";
	console.log(result1);
	objectFin.result1 = result1;
		
	res.render("index.pug", objectFin);
});

/* app.get("/testproduct.html",(req, res) => {
	let id = req.query.id;
	console.log(id);
	
	let html = fs.readFileSync("./public/html/product.html", "utf8");
	res.send(html);
}); */


app.get("/thankyou", (req, res) => {
	res.render("thankyou");
});

app.get("/product.html", (req, res) => {
	let id = req.query.id;
	console.log(id);
	
	if (!id) {
		res.send(errorFormat("please add id query."));
	}
	else {
		//get product info
		sqlQuery(`SELECT * FROM product WHERE id = ${id}`)
		.then((result) => {
			console.log(result);
			let arrayAll = [];
			
			arrayAll.push(result[0].main_image_path);
			arrayAll.push(result[0].title);
			arrayAll.push(result[0]["product_id"]);
			arrayAll.push(result[0].price);
			
			let colorOne = result[0].color_codes;
			colorOne = colorOne.replace(/,/g, "'></div><div class='square ");
			colorOne = "<div class='square " + colorOne + "'></div>";
			arrayAll.push(colorOne);
			
			let sizeOne = result[0].sizes;
			sizeOne = sizeOne.replace(/,/g, '</p></div><div class="circle"><p>');
			sizeOne = '<div class="circle"><p>' + sizeOne + "</p></div>";
			arrayAll.push(sizeOne);
			arrayAll.push(result[0].note);
			
			let textureOne = result[0].texture;			
			let descriptionOne = result[0].description;
			descriptionOne = descriptionOne.replace(/ /g, '<br>');
			descriptionOne = textureOne + "<br>" + descriptionOne;
			arrayAll.push(descriptionOne);
			
			let placeOne = result[0].place;
			placeOne = "素材產地/" + placeOne + "<br>" + "加工產地/" + placeOne;
			arrayAll.push(placeOne);
			arrayAll.push(result[0].story);
			
			let pathOtherImageOne = result[0].other_images_path.split(",");
			for (let i=0; i<pathOtherImageOne.length; i++) {
				arrayAll.push(pathOtherImageOne[i]);
			}
			
			//create object to set variable in pug
			objectFin = {};
			for (let i=0; i<arrayAll.length; i++) {
				objectFin[`arrayAll${i}`] = arrayAll[i];
			}
			
			res.render("product-checkout", objectFin);
		})
		.catch((err) => {
			res.send(errorFormat(err));
		});
	}	
});

app.get("/user-login", (req, res) => {
	res.render("sign-up-in");
});

//Used by login form to send POST request
app.post("/user-login-send-request-signup", (req, res) => {
	console.log(req.body);
	// Set the headers
	let headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'content-type':     'application/json'
	}
	let data = {
		"name":`${req.body.name}`,
		"email":`${req.body.email}`,
		"password":`${req.body.password}`
	};
	
	// Configure the request
	let options = {
		url: 'http://52.15.89.192/api/1.0/user/signup',
		method: 'POST',
		headers: headers,
		json:data
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			if (body.data != undefined) {
				res.cookie("access_token", body.data.access_token, {expires:  new Date(body.data.access_expired)});
				res.cookie("access_expired", body.data.access_expired, {expires:  new Date(body.data.access_expired)});
				res.redirect("/user/profile");
			}else {
				res.send(body);
			}
		}
	})
});

//Used by login form to send POST request
app.post("/user-login-send-request-signin", (req, res) => {
	// Set the headers
	let headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'content-type':     'application/json'
	}
	let data = {
		"provider":"native",
		"email":`${req.body.email}`,
		"password":`${req.body.password}`
	};
	
	// Configure the request
	let options = {
		url: 'http://52.15.89.192/api/1.0/user/signin',
		method: 'POST',
		headers: headers,
		json:data
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			if (body.data != undefined) {
				res.cookie("access_token", body.data.access_token, {expires:  new Date(body.data.access_expired)});
				res.cookie("access_expired", body.data.access_expired, {expires:  new Date(body.data.access_expired)});
				res.redirect("/user/profile");
			}
			else {
				res.send(body);
			}
		}
	})
});

app.get("/user/profile", (req, res) => {
	let accessToken = req.cookies.access_token;
	console.log(req.cookies.access_token);
	if (accessToken != undefined) {
		sqlQuery(`SELECT * FROM user WHERE access_token = "${accessToken}"`)
		.then((result) => {
			console.log(result);
			res.render("user-profile", result[0]);
		})
		.catch ((err) => {
			res.send(err);
		});
	}
	else{
		res.redirect("/user-login");
	}
});

app.get("/admin/product.html",(req, res) => {
	res.render("product.pug");
});

app.get("/admin/campaign.html",(req, res) => {
	res.render("campaign.pug");
});

app.get("/admin/checkout.html", (req, res, next) => {
    let html = fs.readFileSync('./public/html/checkout.html', 'utf8')
    res.send(html);
})



/* ---------------Test Route--------------- */
/* app.get("/test",(req, res) => {
	// Set the headers
	let headers = {
		'content-type':     'application/json',
		'x-api-key': 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG'
	}
	let data = {
		"prime": "0d593d5d87174d208135370533b15a6ee5797448433a053b4bedd3953a0dace1",
		"partner_key": "partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG",
		"merchant_id": "AppWorksSchool_CTBC",
		"details":"TapPay Test",
		"amount": "1",
		"order_number": "123",
		"cardholder": {
			"phone_number": "+886923456789",
			"name": "testtt",
			"email": "testtt@Doe.com"
		},
		"remember": false
	};
	
	// Configure the request
	let options = {
		url: 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
		method: 'POST',
		headers: headers,
		json:data
	}
	
	
	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			res.send(body);
		}
	})
}); */
/* app.post("/test",(req, res) => {
	console.log(req.body);
	
	res.send("post OK.");
}); */

app.get("/test-post", (req, res) => {
	// Set the headers
	let headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'content-type':     'application/json'
	}
	let data = {
		"name":"test13",
		"email":"test13@test.com",
		"password":"test13"
	};
	
	// Configure the request
	let options = {
		url: 'http://localhost:3000/api/1.0/user/signup',
		method: 'POST',
		headers: headers,
		json:data
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			res.send(body);
		}
	})
	
	
	/*//test none JSON POST request
	console.log("test none JSON POST request:");
	request({
			url: 'http://localhost:3000/api/1.0/user/signup',
			method: 'POST',
			headers: {'User-Agent':'Super Agent/0.0.1','content-type':'application/x-www-form-urlencoded'},
			form:{test:"1",test2:"2"}
		}, (e, r, b) => {
			if (!e && r.statusCode == 200) {
			console.log(b);
		}
	}); */
	
	//res.send("POST request done.");
});

app.get("/test-post2", (req, res) => {
	// Set the headers
	let headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'content-type':     'application/json'
	}
	let data = {
		"provider":"native",
		"email":"test13@test.com",
		"password":"test13"
	};
	
	// Configure the request
	let options = {
		url: 'http://localhost:3000/api/1.0/user/signin',
		method: 'POST',
		headers: headers,
		json:data
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			res.send(body);
		}
	})
});

app.get("/test-postfb", (req, res) => {
	// Set the headers
	let headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'content-type':     'application/json'
	}
	let data = {
		"provider":"facebook",
		"access_token":"EAAFqxw9GAHQBALUQqQI3QrSIyWMSJj2d7MkWmun2bO7NkZBZBCdYalxIZAt7cOZBeVeXSBryFA06AZBZAsHFBHhhTXbwf4myDpkCc0zKWcjicYDj6sNu2OzGhQy6scuyGZBzfOBVcvyumxzmQgMwqdB36zuoM8DsBLR9NiIfMyTyo0rlOQUmQWj8vpiPJzGubb0ilpT8hZCWEwZDZD",
	};
	
	// Configure the request
	let options = {
		url: 'http://localhost:3000/api/1.0/user/signin',
		method: 'POST',
		headers: headers,
		json:data
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			res.send(body);
		}
	})
});

app.get("/test-get-profile", (req, res) => {
	// Set the headers
	let headers = {
		Authorization: "Bearer 9721a07e841e440bc884cb39292dfb216c0e018e0595ed6d40c6464c986a7163"
	}

	// Configure the request
	let options = {
		url: 'http://localhost:3000/api/1.0/user/profile',
		method: 'GET',
		headers: headers,
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			res.send(body);
		}
	})
	
/* 	let x = HttpRequest(headers, options);
	console.log(x);
	res.send(x); */	
});

app.get("/test-get-fb", (req, res) => {
	// Configure the request
	let options = {
		url: "https://graph.facebook.com/v3.2/me?fields=id%2Cname%2Cemail&access_token=EAAFqxw9GAHQBAOLiCmAZC65ZAHVIk0vcq8OjKCvB0BfRLQ9noOZBbjrFPLcT6krFskMtkE6T7YhZAeoDjkERZBrSiStavoOtIy5cEPQH08S2bc8TIurd0tF5RYVZB9j1rrViv9hXHOQKPUeorT5vP0CDbCnCxJNvQ8iVpl0SQHae7VEXqYnwSWvD7LK0Gj6ZBZBXcZAntU7xNgAZDZD",
		method: 'GET',
	}

	// Start the request
	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			console.log(body);
			res.send(body);
		}
	})
});

app.get("/testcache", (req, res) => {
	obj = { my: "Special", variable: 42 };
	myCache.set( "myKey", obj, function( err, success ){
		if( !err && success ){
			console.log( success );
			// true
			// ... do something ...
		}
	});
	
	value1 = myCache.get( "myKey" );
	if ( value1 == undefined ){
		// handle miss!
	}
	console.log(value1);
	
	value2 = myCache.del( "myKey" );
	console.log(value2);
	
	value1 = myCache.get( "myKey" );
	if ( value1 == undefined ){
		// handle miss!
		console.log("x");
	}
	console.log(value1);
	
	let mykeys = myCache.keys();
	console.log( mykeys );
	
	myCache.getStats();
	
	
	res.send("done.");
});

app.get("/testaws", (req, res) => {
	// Create unique bucket name
	var bucketName = 'node-sdk-sample-' + uuid.v4();
	// Create name for uploaded object key
	var keyName = 'hello_world.txt';

	// Create a promise on S3 service object
	var bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();

	// Handle promise fulfilled/rejected states
	bucketPromise.then(
		function(data) {
			// Create params for putObject call
			var objectParams = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
			// Create object upload promise
			var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
			uploadPromise.then(
				function(data) {
					console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
				}
			);
			res.send("OK");
		}
	)
	.catch(
		function(err) {
			console.error(err, err.stack);
			res.send(err);
		}
	);
});

app.get("/testaws1", (req, res) => {
	s3 = new AWS.S3({apiVersion: "2006-03-01"});
	console.log(s3);
	
	s3.listBuckets((err, data)=> {
		if (err) {
			console.log(err);
		}
		else {
			console.log(data);
		}
	});
});

app.get("/testaws2", (req, res) => {
	s3 = new AWS.S3({apiVersion: "2006-03-01"});
	
	const params = {Bucket: 'bucket', Key: 'key', Body: stream};
	s3.upload(params, function(err, data) {
	  console.log(err, data);
	});
});





/* ---------------API 1.0--------------- */
/* ---------------Product input form--------------- */
app.post("/api/1.0/admin/product", upload.fields([{name: "mainImage", maxCount: 1}, {name: "images", maxCount: 50}]),  async (req, res) => {
	const productId = req.body.productId;
	const title = req.body.title;
	const category = req.body.category;
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
	
	s3 = new AWS.S3({apiVersion: "2006-03-01"});
	
	const params = {Bucket: 'test201931300001', Key: `${Date.now()}-${req.files.mainImage[0].originalname}`,  ACL: 'public-read', Body: req.files.mainImage[0].buffer};
	
	//upload main image
	s3.upload(params, function(err, data) {
		if (err) {
            console.error(err);
            return res.status(500).send('failed to upload to s3').end();
        }
		else {
			console.log(data);
			const mainImagePath = data.Location;
			
			//upload other images
			const array1 = req.files.images.map((item) => {
				const params = {Bucket: 'test201931300001', Key: `${Date.now()}-${item.originalname}`,  ACL: 'public-read', Body: item.buffer};
				console.log(params);
				
				//async function use Promise
				const promiseUpload = new Promise ((reso, rej) => {
					s3.upload(params, function(err, data) {
						if (err) {
							console.error(err);
							return rej('failed to upload to s3');
						}
						else {
							console.log(data);
							return reso(data.Location);
						}
					});
				});				
				return promiseUpload;
			});			
			
			//after all map async function finish, do mysql query
			Promise.all(array1).then( async (array1) => {
				console.log(mainImagePath);
				const imagesPath = array1;
				console.log(imagesPath);
				
				//Insert product table
				let result1 = await sqlQuery(`INSERT INTO product (product_id, title, category, description, price, texture, wash, place, note, story, color_codes, color_names, sizes, main_image_path, other_images_path) VALUES ('${productId}', '${title}', '${category}', "${description}", "${price}", "${texture}", "${wash}", "${place}", "${note}", "${story}", "${colorCodes}", "${colorNames}", "${sizes}", "${mainImagePath}", "${imagesPath}")`);
				console.log("1 record inserted(table product), ID: " + result1.insertId);
					
				//Insert variants table
				let productType = 1;

				const arrayOfColorCodes = colorCodes.split(",");
				const arrayOfColorNames = colorNames.split(",");
				const arrayOfSizes = sizes.split(",");
				const arrayOfVariants = [];


				if (arrayOfColorCodes.length != arrayOfColorNames.length){
					console.log("color_codes != color_names.");
					res.send("color_codes != color_names.");
				}
				else {
					let arrayTemp = [];
					for (let i=0 ; i < arrayOfColorCodes.length ; i++){
						for (let x=0 ; x < arrayOfSizes.length ; x++) {
							console.log(arrayOfColorCodes[i], arrayOfSizes[x], productType);
							arrayTemp = [productId, productType, arrayOfColorCodes[i], arrayOfColorNames[i], arrayOfSizes[x], price, "0"];
							arrayOfVariants.push(arrayTemp);
							
							productType += 1;
						}		
					};
					console.log(arrayOfVariants);
					pool.query(`INSERT INTO variants (product_id, product_type, color_code, color_name, size, variant_price, stock) VALUES ?`, [arrayOfVariants], function (err, result) {
						if (err) throw err;
						console.log("Number of records inserted(table variants) :" + result.affectedRows);
						
						//clear cache
						let value1 = myCache.del("productDetail${id}");
						if (value1 === 1) {
							console.log("clear cache succeed.");
						}
						
						res.redirect("/admin/product.html");
					});
				}
			});
		}
	});
});


/* app.post("/api/1.0/admin/product", upload.fields([{name: "mainImage", maxCount: 1}, {name: "images", maxCount: 50}]),  async (req, res) => {
	const productId = req.body.productId;
	const title = req.body.title;
	const category = req.body.category;
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
	const mainImagePath = pathTransform(req.files["mainImage"][0].path);
	const imagesCount = req.files["images"].length;
	const imagesPath = [];
		
	//combine images path
	for (let i=0; i < imagesCount ; i++){
		imagesPath.push(pathTransform(req.files["images"][i].path));
	}
	
	console.log(imagesPath);
	console.log(imagesPath.join(","));
	
	
	//Insert product table
	let result1 = await sqlQuery(`INSERT INTO product (product_id, title, category, description, price, texture, wash, place, note, story, color_codes, color_names, sizes, main_image_path, other_images_path) VALUES ('${productId}', '${title}', '${category}', "${description}", "${price}", "${texture}", "${wash}", "${place}", "${note}", "${story}", "${colorCodes}", "${colorNames}", "${sizes}", "${mainImagePath}", "${imagesPath}")`);
	console.log("1 record inserted(table product), ID: " + result1.insertId);
		
	//Insert variants table
	let productType = 1;

	const arrayOfColorCodes = colorCodes.split(",");
	const arrayOfColorNames = colorNames.split(",");
	const arrayOfSizes = sizes.split(",");
	const arrayOfVariants = [];


	if (arrayOfColorCodes.length != arrayOfColorNames.length){
		console.log("color_codes != color_names.");
		res.send("color_codes != color_names.");
	}
	else {
		let arrayTemp = [];
		for (let i=0 ; i < arrayOfColorCodes.length ; i++){
			for (let x=0 ; x < arrayOfSizes.length ; x++) {
				console.log(arrayOfColorCodes[i], arrayOfSizes[x], productType);
				arrayTemp = [productId, productType, arrayOfColorCodes[i], arrayOfColorNames[i], arrayOfSizes[x], price, "0"];
				arrayOfVariants.push(arrayTemp);
				
				productType += 1;
			}		
		};
		console.log(arrayOfVariants);
		sql.query(`INSERT INTO variants (product_id, product_type, color_code, color_name, size, variant_price, stock) VALUES ?`, [arrayOfVariants], function (err, result) {
			if (err) throw err;
			console.log("Number of records inserted(table variants) :" + result.affectedRows);
			
			//clear cache
			let value1 = myCache.del("productDetail${id}");
			if (value1 === 1) {
				console.log("clear cache succeed.");
			}
			
			res.redirect("/admin/product.html");
		});
	}
	

	
});
 */

/* ---------------Campaigns input form--------------- */
app.post("/api/1.0/admin/campaigns", upload.single("picture"), (req, res) =>{
	let productId = req.body.productId;
	let story = req.body.story;
	//console.log(productId, "\n", picture, "\n", story);
	
	s3 = new AWS.S3({apiVersion: "2006-03-01"});
	
	const params = {Bucket: 'test201931300001', Key: `${Date.now()}-${req.file.originalname}`,  ACL: 'public-read', Body: req.file.buffer};
	
	console.log(params);
	
	//upload image
	s3.upload(params, (err, data) => {
		if (err) {
            console.error(err);
            return res.status(500).send('failed to upload to s3').end();
        }
		else {
			console.log(data);
			const picture = data.Location;
			
			//Insert campaigns table
			sqlQuery(`INSERT INTO campaigns (product_id, picture_path, story) VALUES ('${productId}', '${picture}', '${story}')`)
			.then((result) => {
				console.log("1 record inserted(table campaigns), ID: " + result.insertId);
				//clear cache
				let value1 = myCache.del("campaignsAll");
				if (value1 === 1) {
					console.log("clear cache succeed.");
				}
				
				res.redirect("/admin/campaign.html");
			})
			.catch((err) => {
				res.send(err);
			});			
		}
	});
});

/* ---------------Product Search API--------------- */
app.get("/api/1.0/products/search", async (req, res) => {
	let objectFin;
	let arrayColors;
	let arrayVariants = [];
	let arrayAll;
	let keyword = req.query.keyword;
	let paging = parseInt(req.query.paging);
	let itemNumPerPage = 3;
	let itemStartNum;
	let totalItemNum;
	
	try{
		console.log(keyword, paging);
		
		//check total item num
		totalItemNum = await sqlQuery(`SELECT COUNT(*) FROM product WHERE (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%')`);
		totalItemNum = totalItemNum[0]["COUNT(*)"];
		console.log(totalItemNum);
		if (totalItemNum === 0) {
			res.send(`Can not find ${keyword}.`);
		}
		
		//ckeck paging
		if (isNaN(paging)) {
			paging = 0;
		}
		itemStartNum = paging*itemNumPerPage;
		
		//make colors array
		arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product WHERE (product_id LIKE '%${keyword}%' OR title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%') LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
		arrayColors = transformToArrayColors(arrayColors);
		
		//get product_id and send to variants
		let temp = await sqlQuery(`SELECT product_id FROM product WHERE (product_id LIKE '%${keyword}%' OR title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%')`);
		temp = temp.reduce((accumulator,currentValue) => {
			//console.log(accumulator,"\n",currentValue.product_id);
			accumulator += "," + `"${currentValue.product_id}"`;
			return accumulator;
		},`"${temp[0].product_id}"`);
		//console.log(temp);
		//console.log(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id IN (${temp}) ORDER BY variant_id DESC`);
		
		//make variants array
		let result1 = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id IN (${temp}) ORDER BY variant_id DESC`);
		//console.log(result1);
		result1 = transformToArrayVariants(result1);
		for (let i=itemStartNum ; i < (itemStartNum + itemNumPerPage) ;i++) {
			arrayVariants.push(result1[i]);
		};
		
		//make final array
		arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product WHERE (product_id LIKE '%${keyword}%' OR title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%') LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
		arrayAll = arrayAll.map((obj, index, array1) => {
			obj.sizes = obj.sizes.split(",");						//change sizes string to array
			obj.main_image = obj.main_image;
			obj.images = obj.images.split(",");						//change images string to array
			obj.images = obj.images.map((item, index2, array2) => {
				return item;
			});
			obj.colors = arrayColors[index].colors;
			obj.variants = arrayVariants[index];
			return obj;
		});
		
		//check for paging
		paging = paging +1;
		if (paging === Math.ceil(totalItemNum/itemNumPerPage)) {
			objectFin = {data: arrayAll};
			res.send(JSON.stringify(objectFin,null,4));
		}
		else if (paging < Math.ceil(totalItemNum/itemNumPerPage)) {
			objectFin = {data: arrayAll, paging: paging};
			res.send(JSON.stringify(objectFin,null,4));
		}
		else{
			console.log("Out of page.")
			res.send("Out of page.");
		}

	}
	catch (e) {
		res.status(500).send(e);
	}
});

/* ---------------Product Details API--------------- */
app.get("/api/1.0/products/details", async (req, res) => {
	let objectFin;
	let arrayColors;
	let arrayVariants = [];
	let arrayAll;
	let id = req.query.id;
	console.log(id);
	
	//get cache
	let value1 = myCache.get(`productDetail${id}`);
	
	//check cache
	if ( value1 == undefined ){
		//if not, find data from database
		try{
			//check id exist or not
			let num = await sqlQuery(`SELECT COUNT(*) FROM product WHERE product_id = "${id}"`);
			num = num[0]["COUNT(*)"];
			console.log(num);
			
			if (num != 0) {
				//make colors array
				arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product WHERE product_id = "${id}"`);
				arrayColors = transformToArrayColors(arrayColors);
				
				//make variants array
				arrayVariants = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id = "${id}" ORDER BY variant_id DESC`);
				arrayVariants = transformToArrayVariants(arrayVariants);
				
				//make final array
				arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product WHERE product_id = "${id}"`);
				arrayAll = arrayAll.map((obj, index, array1) => {
					obj.sizes = obj.sizes.split(",");						//change sizes string to array
					obj.main_image = obj.main_image;
					obj.images = obj.images.split(",");						//change images string to array
					obj.images = obj.images.map((item, index2, array2) => {
						return item;
					});
					obj.colors = arrayColors[index].colors;
					obj.variants = arrayVariants[index];
					return obj;
				});
				objectFin = {data: arrayAll[0]};
				//console.log(arrayAll);
				console.log(JSON.stringify(objectFin,null,4));
				
				
				//save in cache
				let success = myCache.set(`productDetail${id}`, objectFin);
				if(success){
					console.log("cache succeed.");
				}
				else {
					console.log("cache failed.");
				}
				
				res.send(JSON.stringify(objectFin,null,4));
			}
			else {
				console.log("Product id does not exist.");
				res.send("Product id does not exist.");
			}
		}
		catch (e) {
			res.status(500).send(e);
		}
	}
	else {
		//if yes, send cache
		console.log("cache sended.");
		res.send(value1);
	}
	

});

/* ---------------Product List API--------------- */
app.get("/api/1.0/products/:category", async (req, res) => {			//this route must under other products/ end point route
	const category = req.params.category;
	let objectFin;
	let arrayColors;
	let arrayVariants = [];
	let arrayAll;
	//let runStatus = 0;
	let paging = parseInt(req.query.paging);
	let itemNumPerPage = 3;
	let itemStartNum;
	let totalItemNum;
	console.log(paging);
	
	/* 	paging undefined --> 0 --> 1
		paging 1 --> 3 --> 2
		paging 2 --> 6 --> 3
		paging *3  */
	
	try {
		if (category === "all") {
			//ckeck paging
			if (isNaN(paging)) {
				paging = 0;
			}
			itemStartNum = paging*itemNumPerPage;
			
			//make colors array
			arrayColors =  sqlQuery(`SELECT color_codes, color_names FROM product LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
			arrayColors = transformToArrayColors(arrayColors);
			
			//make variants array
			let result1 = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants ORDER BY variant_id DESC`);
			result1 = transformToArrayVariants(result1);
			for (let i=itemStartNum ; i < (itemStartNum + itemNumPerPage) ;i++) {
				arrayVariants.push(result1[i]);
			};
			
			//make final array
			arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
			arrayAll = arrayAll.map((obj, index, array1) => {
				obj.sizes = obj.sizes.split(",");						//change sizes string to array
				obj.main_image = obj.main_image;
				obj.images = obj.images.split(",");						//change images string to array
				obj.images = obj.images.map((item, index2, array2) => {
					return item;
				});
				obj.colors = arrayColors[index].colors;
				obj.variants = arrayVariants[index];
				return obj;
			});
			
			//check total item num
			totalItemNum = await sqlQuery(`SELECT COUNT(*) FROM product`);
			totalItemNum = totalItemNum[0]["COUNT(*)"];
			console.log(totalItemNum);
			
			//check for paging
			paging = paging +1;
			if (paging === Math.ceil(totalItemNum/itemNumPerPage)) {
				objectFin = {data: arrayAll};
				res.send(JSON.stringify(objectFin,null,4));
			}
			else if (paging < Math.ceil(totalItemNum/itemNumPerPage)) {
				objectFin = {data: arrayAll, paging: paging};
				res.send(JSON.stringify(objectFin,null,4));
			}
			else{
				console.log("Out of page.")
				res.send("Out of page.");
			}
			//console.log(arrayAll);
			console.log(JSON.stringify(objectFin,null,4));
		}
		else if (category === "women" || category === "men" || category === "accessories") {
			
			//ckeck paging
			if (isNaN(paging)) {
				paging = 0;
			}
			itemStartNum = paging*itemNumPerPage;
			
			//make colors array
			arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product WHERE category = "${category}" LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
			arrayColors = transformToArrayColors(arrayColors);
			
			//get product_id and send to variants
			let temp = await sqlQuery(`SELECT product_id FROM product WHERE category = "${category}"`);
			temp = temp.reduce((accumulator,currentValue) => {
				//console.log(accumulator,"\n",currentValue.product_id);
				accumulator += "," + `"${currentValue.product_id}"`;
				return accumulator;
			},`"${temp[0].product_id}"`);
			
			//make variants array
			let result1 = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id IN (${temp}) ORDER BY variant_id DESC`);
			result1 = transformToArrayVariants(result1);
			for (let i=itemStartNum ; i < (itemStartNum + itemNumPerPage) ;i++) {
				arrayVariants.push(result1[i]);
			};
			
			//make final array
			arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product WHERE category = "${category}" LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
			arrayAll = arrayAll.map((obj, index, array1) => {
				obj.sizes = obj.sizes.split(",");						//change sizes string to array
				obj.main_image = obj.main_image;
				obj.images = obj.images.split(",");						//change images string to array
				obj.images = obj.images.map((item, index2, array2) => {
					return item;
				});
				obj.colors = arrayColors[index].colors;
				obj.variants = arrayVariants[index];
				return obj;
			});
			
			//check total item num
			totalItemNum = await sqlQuery(`SELECT COUNT(*) FROM product WHERE product_id IN (${temp})`);
			totalItemNum = totalItemNum[0]["COUNT(*)"];
			console.log(totalItemNum);
			
			//check for paging
			paging = paging +1;
			if (paging === Math.ceil(totalItemNum/itemNumPerPage)) {
				objectFin = {data: arrayAll};
				res.send(JSON.stringify(objectFin,null,4));
			}
			else if (paging < Math.ceil(totalItemNum/itemNumPerPage)) {
				objectFin = {data: arrayAll, paging: paging};
				res.send(JSON.stringify(objectFin,null,4));
			}
			else{
				console.log("Out of page.")
				res.send("Out of page.");
			}
			//console.log(arrayAll);
			console.log(JSON.stringify(objectFin,null,4));
		}
		else {
			res.send("Category dose not exist.");
		}
	}
	catch (e) {
		res.status(500).send(e.message);
	}
});

/* ---------------Marketing Campaigns API--------------- */
app.get("/api/1.0/marketing/campaigns", async (req, res) => {
	//get cache
	let value1 = myCache.get("campaignsAll");
	
	//check cache
	if ( value1 == undefined ){
		//if not, find data from database
		let arrayCampaigns;
		let objectFin;
		//make campaigns array
		arrayCampaigns = await sqlQuery(`SELECT campaigns_id, product_id, picture_path AS picture, story FROM campaigns`);
		
		//transform correct format
		arrayCampaigns = arrayCampaigns.map((obj, index, array1) => {
			//obj.picture = pathTransformNormal2(obj.picture)
			return obj;
		});
		
		objectFin = {data:arrayCampaigns};
		
		//save in cache
		let success = myCache.set("campaignsAll", objectFin);
		if(success){
			console.log("cache succeed.");
		}
		else {
			console.log("cache failed.");
		}
		
		res.send(objectFin);
	}
	else {
		//if yes, send cache
		console.log("cache sended.");
		res.send(value1);
	}	
});

/* ---------------User Sign Up API--------------- */
app.post("/api/1.0/user/signup", async (req, res) => {
	console.log(req.body);
	//console.log(JSON.stringify(req.body));

	
	//check content-type
	if (req.headers['content-type'] === 'application/json' && req.body.name != undefined && req.body.email != undefined && req.body.password != undefined) {
		let name = req.body.name;
		let email = req.body.email;
		let password = req.body.password;
		let provider = "native";
		let picture = "";
		
		//check email from database
		let userNum = await sqlQuery(`SELECT COUNT(*) FROM user WHERE email = "${email}"`);
		userNum = userNum[0]["COUNT(*)"];
		
		if(userNum != 0) {
			res.send(errorFormat(`${email} has been used.`));
		}
		else {
			//create unique hash token
			let hash = crypto.createHash("sha256");
			let date = Date.now();
			hash.update(`${date}`);
			let accessToken = hash.digest("hex");
			let accessTokenExpired = date + 86400000;			//set one day expired
			
			console.log(provider,"\n",name,"\n",email,"\n",password,"\n",picture,"\n",accessToken,"\n",accessTokenExpired);
			//insert database
			let result1 = await sqlQuery(`INSERT INTO user (provider, name, email, password, picture, access_token, access_expired) VALUES ('${provider}', '${name}', '${email}', "${password}", "${picture}", "${accessToken}", "${accessTokenExpired}")`);
			let id = result1.insertId;
			console.log("1 record inserted(table user), ID: " + result1.insertId);
			
			//create response object
			let objectFin = {};
			objectFin["access_token"] = accessToken;
			objectFin["access_expired"] = accessTokenExpired;
			objectFin["user"] = {
				id: id,
				provider: provider,
				name: name,
				email: email,
				picture: picture
			};
			objectFin = dataFormat(objectFin);
				
			res.send(objectFin);
		}
		
	}
	else {
		res.send(errorFormat("POST request is rejected, check list: 1.'content-type' must be 'application/json'. 2.Something wrong with name, email or password."));		
	}	
});

/* ---------------User Sign In API--------------- */
app.post("/api/1.0/user/signin", async (req, res) => {
	console.log(req.body);
	
	//check content-type
	if (req.headers['content-type'] === 'application/json') {
		let provider = req.body.provider;
		let email = req.body.email;
		let password = req.body.password;
		let accessTokenFB = req.body["access_token"];
		
		//check provider
		if (provider === "native") {
			//check email and password
			if(email === undefined || password === undefined || email === "" || password === "") {
				res.send(dataFormat("email and password are required."));
			}
			else {
				//check email from database
				let userNum = await sqlQuery(`SELECT COUNT(*) FROM user WHERE email = "${email}"`);
				userNum = userNum[0]["COUNT(*)"];
				
				if(userNum === 0) {
					res.send(errorFormat(`${email} has not found.`));
				}
				else {
					//check password
					let result3 = await sqlQuery(`SELECT password FROM user WHERE email = "${email}"`);
					result3 = result3[0].password;
					
					if (result3 === password) {
						//succeed sign in
						//create unique hash token
						let hash = crypto.createHash("sha256");
						let date = Date.now();
						hash.update(`${date}`);
						let accessToken = hash.digest("hex");
						let accessTokenExpired = date + 86400000;			//set one day expired
						
						//update token and expired
						let result1 = await sqlQuery(`UPDATE user SET access_token = "${accessToken}", access_expired = "${accessTokenExpired}" WHERE email = "${email}"`);
						console.log(result1.affectedRows + " record(s) updated");
						
						//get id, name and picture
						let result2 = await sqlQuery(`SELECT id, name, picture FROM user WHERE email = "${email}"`);
						let id = result2[0].id;
						let name = result2[0].name;
						let picture = result2[0].picture;
						
						//create response object
						let objectFin = {};
						objectFin["access_token"] = accessToken;
						objectFin["access_expired"] = accessTokenExpired;
						objectFin["user"] = {
							id: id,
							provider: provider,
							name: name,
							email: email,
							picture: picture
						};
						objectFin = dataFormat(objectFin);
						
						res.send(objectFin);
					}
					else {
						res.send(errorFormat("Wrong password."));
					}
				}
			}
		}
		else if (provider === "facebook") {
			//check FB token
			if (accessTokenFB === undefined || accessTokenFB === "") {
				res.send(errorFormat("access_token is required."));
			}
			else {
				//check FB token with database
				let result1 = await sqlQuery(`SELECT COUNT(*) FROM user WHERE access_token_fb = "${accessTokenFB}"`);
				result1 = result1[0]["COUNT(*)"];
				console.log(result1);
				
				if(result1 === 0) {
					console.log("FB token is new. get FB data.");
					//get user profile from FB
					console.log("get user profile from FB");

					let options = {
						url: `https://graph.facebook.com/v3.2/me?fields=id%2Cname%2Cemail&access_token=${accessTokenFB}`,
						method: 'GET',
					}
					
					request(options, async (error, response, body) => {
						if (!error && response.statusCode == 200) {
							body = JSON.parse(body);
							console.log(body, body.name, body.email);
							email = body.email;
							name = body.name;
							
							//check user profile with database
							let dataFB = await sqlQuery(`SELECT COUNT(*) FROM user WHERE email = "${body.email}"`);
							dataFB = dataFB[0]["COUNT(*)"];
							console.log(dataFB);
							if (dataFB != 0) {
								console.log("you are old user, update your FB token.");
								//if exist update FB token
								//create unique hash token
								let hash = crypto.createHash("sha256");
								let date = Date.now();
								hash.update(`${date}`);
								let accessToken = hash.digest("hex");
								let accessTokenExpired = date + 86400000;			//set one day expired
								
								//update token, expired and FB token
								let result2 = await sqlQuery(`UPDATE user SET access_token = "${accessToken}", access_expired = "${accessTokenExpired}", access_token_fb = "${accessTokenFB}" WHERE email = "${email}"`);
								console.log(result2.affectedRows + " record(s) updated");
								
								//get id and picture
								let result3 = await sqlQuery(`SELECT id, picture FROM user WHERE email = "${email}"`);
								let id = result3[0].id;
								let picture = result3[0].picture;
								
								//create response object
								let objectFin = {};
								objectFin["access_token"] = accessToken;
								objectFin["access_expired"] = accessTokenExpired;
								objectFin["user"] = {
									id: id,
									provider: provider,
									name: name,
									email: email,
									picture: picture
								};
								objectFin = dataFormat(objectFin);
								
								res.send(objectFin);

							}
							else {
								console.log("you are new user, insert your new data.");
								//if not create new user
								//create unique hash token
								let hash = crypto.createHash("sha256");
								let date = Date.now();
								hash.update(`${date}`);
								let accessToken = hash.digest("hex");
								let accessTokenExpired = date + 86400000;			//set one day expired
									
								//insert database
								let picture = "";
								console.log(provider,"\n",name,"\n",email,"\n",picture,"\n",accessToken,"\n",accessTokenExpired);
								let result2 = await sqlQuery(`INSERT INTO user (provider, name, email, picture, access_token, access_expired, access_token_fb) VALUES ('${provider}', '${name}', '${email}', "${picture}", "${accessToken}", "${accessTokenExpired}", "${accessTokenFB}")`);
								let id = result2.insertId;
								console.log("1 record inserted(table user), ID: " + result2.insertId);
								
								//create response object
								let objectFin = {};
								objectFin["access_token"] = accessToken;
								objectFin["access_expired"] = accessTokenExpired;
								objectFin["user"] = {
									id: id,
									provider: provider,
									name: name,
									email: email,
									picture: picture
								};
								objectFin = dataFormat(objectFin);
								
								res.send(objectFin);
							}
						}
						else {
							res.send(error);
						}
					});
				}
				else {
					console.log("FB token already storage. send user profile.");
					//succeed sign in
					//create unique hash token
					let hash = crypto.createHash("sha256");
					let date = Date.now();
					hash.update(`${date}`);
					let accessToken = hash.digest("hex");
					let accessTokenExpired = date + 86400000;			//set one day expired
					
					//update token and expired
					let result2 = await sqlQuery(`UPDATE user SET access_token = "${accessToken}", access_expired = "${accessTokenExpired}" WHERE access_token_fb = "${accessTokenFB}"`);
					console.log(result2.affectedRows + " record(s) updated");
						
					//get id, name and picture
					let result3 = await sqlQuery(`SELECT id, name, email, picture FROM user WHERE access_token_fb = "${accessTokenFB}"`);
					let id = result3[0].id;
					let name = result3[0].name;
					let email = result3[0].email;		//add email
					let picture = result3[0].picture;
					
					//create response object
					let objectFin = {};
					objectFin["access_token"] = accessToken;
					objectFin["access_expired"] = accessTokenExpired;
					objectFin["user"] = {
						id: id,
						provider: provider,
						name: name,
						email: email,		//add email
						picture: picture
					};
					objectFin = dataFormat(objectFin);
					
					res.send(objectFin);
				}
				
			}
		}
		else {
			res.send(errorFormat("unknown provider."));
		}	
	}
	else {
		res.send(errorFormat("POST request is rejected, check list: 1.'content-type' must be 'application/json'. 2.Something wrong with name, email or password."));		
	}
});

/* ---------------User Profile API--------------- */
app.get("/api/1.0/user/profile", async (req, res) => {
	console.log(req.headers);
	let authorization = req.headers.authorization;
	
	//check authorization
	if (authorization) {
		authorization = authorization.split(" ");
		console.log(authorization, authorization[0], authorization[1]);
		//check Bearer
		if(authorization[0] === "Bearer") {
			let result1 = await sqlQuery(`SELECT COUNT(*) FROM user WHERE access_token = "${authorization[1]}"`);
			result1 = result1[0]["COUNT(*)"];
			//check token in database
			if (result1 != 0) {
				let result2 = await sqlQuery(`SELECT access_expired FROM user WHERE access_token = "${authorization[1]}"`);
				result2 = result2[0]["access_expired"];
				console.log(result1, result2, Date.now());
				//check expired date in database
				if (Date.now() < result2) {
					//succeed
					//get id, provider, name, email and picture
					let result3 = await sqlQuery(`SELECT id, provider, name, email, picture FROM user WHERE access_token = "${authorization[1]}"`);
					let id = result3[0].id;
					let provider = result3[0].provider;
					let name = result3[0].name;
					let email = result3[0].email;
					let picture = result3[0].picture;
					
					//create response object
					let objectFin = {
						id: id,
						provider: provider,
						name: name,
						email: email,
						picture: picture
					};
					objectFin = dataFormat(objectFin);
					
					res.send(objectFin);
				}
				else {
					res.send(errorFormat("expired token."));
				}
			}
			else {
				res.send(errorFormat("Wrong token."));
			}			
		}
		else {
			res.send(errorFormat("Please use Bearer schemes."));
		}
	}
	else {
		res.send(errorFormat("authorization is required."));
	}
});

/* ---------------Order Check Out API--------------- */
app.post("/api/1.0/order/checkout", async (req, res) => {
	console.log(req.body);
	
	//check content-type
	if (req.headers['content-type'] === 'application/json') {
		let prime = req.body.prime;
		let shipping = req.body.order.shipping;
		let payment = req.body.order.payment;
		let subtotal = req.body.order.subtotal;
		let freight = req.body.order.freight;
		let total = req.body.order.total;
		let name = req.body.order.recipient.name;
		let phone = req.body.order.recipient.phone;
		let email = req.body.order.recipient.email;
		let address = req.body.order.recipient.address;
		let time = req.body.order.recipient.time;
		let list = JSON.stringify(req.body.order.list);
		let orderStatus = "unpaid";
		
		//INSERT orders database
		let result1 = await sqlQuery(`INSERT INTO orders (prime, shipping, payment, subtotal, freight, total, recipient_name, recipient_phone, recipient_email, recipient_address, recipient_time, list, order_status) VALUES ("${prime}", "${shipping}", "${payment}", ${subtotal}, ${freight}, ${total}, "${name}", "${phone}", "${email}", "${address}", "${time}", '${list}', "${orderStatus}")`);
		let id = result1.insertId;
		console.log("1 record inserted(table user), ID: " + result1.insertId);
		
		//access to TapPay server and check info
		let headers = {
			'content-type':     'application/json',
			'x-api-key': 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG'
		}
		let data = {
			"prime": prime,
			"partner_key": "partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG",
			"merchant_id": "AppWorksSchool_CTBC",
			"details":"TapPay Test",
			"amount": "1",
			"order_number": id,
			"cardholder": {
				"phone_number": phone,
				"name": name,
				"email": email
			},
			"remember": false
		};
		let options = {
			url: 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
			method: 'POST',
			headers: headers,
			json:data
		}
		request(options, async (error, response, body) => {
			if (!error && response.statusCode == 200) {
				console.log(body);
				
				//record info from TapPay server
				let tappayServerReturn = JSON.stringify(body);
				let result2 = await sqlQuery(`UPDATE orders SET tappay_server_return = '${tappayServerReturn}' WHERE id = ${id}`);
				console.log(result2.affectedRows + " record(s) updated (tappay_server_return)");
				
				//check status
				if (body.status === 0) {
					//succeed
					orderStatus = "paid off";
					let result3 = await sqlQuery(`UPDATE orders SET order_status = "${orderStatus}" WHERE id = ${id}`);
					console.log(result3.affectedRows + " record(s) updated (order_status)");
					
					res.send(dataFormat({"number":`${id}`}));
				}
				else {
					//failed
					res.send(errorFormat("paid failed."));
				}
			}
		});
	}
	else {
		res.send(errorFormat("content-type only accept application/json."));
	}
});




/* ---------------Promise--------------- */
//Use Promise for MySQL .query()
function sqlQuery (query1) {
	return new Promise ((reso, rej) => {
		pool.query(query1,(err, result, fields) => {
			if (err) {
				rej(err);
			}
			else {
				reso(result);
			}
		});
	});
};

//Use Promise for request
function HttpRequest (headers, options) {
	options.headers = headers;

	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			return body;
		}
	})
}





/* replace all "\\" to "\\\\",prevent been escaped when INSERT INTO MySQL */
function pathTransform (str) {
	let newstr = str.replace(/\\/g,"\\\\");
	//console.log(str, "\n", newstr);
	//console.log("public\\uploads\\1550573899451-main.jpg");
	//console.log("public\\\\uploads\\\\1550573899451-main.jpg");
	return newstr;
}


/* ---------------Transform sql result to correct format--------------- */
//main_image and images
function pathTransformNormal (str) {
	let newstr = "http://52.15.89.192/" + str;
	newstr = newstr.replace(/\\/g,"/");
	newstr = newstr.replace("public","static");
	return newstr;
}

//picture_path
function pathTransformNormal2 (str) {
	str = str.replace(/\\/g,"/");
	str = str.replace("public","static");
	return str;
}


//colors
function transformToArrayColors (arr) {
try {
	let res = arr.map((item, index, array1) => {
		let str1 = item.color_codes.split(",");
		let str2 = item.color_names.split(",");
		let temp = str1.map((item2, index2, array2) => {
			return {code:array2[index2],name:str2[index2]};	
		});
		return {colors:temp};
	});
	return res;
} catch(e) {
		res.status(500).send(`something wen't wrong`);}
};
//Variants(Input ORDER BY DESC, output ORDER BY ASC)
function transformToArrayVariants (arr) {
	let array1 = [];
	let array2 = [];
	for (let i=0; i < arr.length ;i++) {
		if (arr[i].product_type === "1") {
			array2.unshift({color_code:arr[i].color_code, size:arr[i].size, stock:arr[i].stock})
			array1.unshift(array2);
			array2 = [];
		}
		else {
			array2.unshift({color_code:arr[i].color_code, size:arr[i].size, stock:arr[i].stock})
		}
	}
	return array1;
};

/* ---------------Create format array---------------施工中 */
/* function createArrayColors (callback) {
	let arrayColors;
	callback();
	
	sql.query("SELECT color_codes, color_names FROM product", (err, result, fields) => {
		arrayColors = transformToArrayColors(result)
		console.log(transformToArrayColors(result));
		//return transformToArrayColors(result);
		//console.log(arrayColors);
		//console.log(JSON.stringify(arrayColors, null, 4));
		//console.log("%j",arrayColors);
	});
	console.log()
	return arrayColors;
}

function createArrayVariants () {
	sql.query("SELECT product_id AS id, product_type, color_code, size, stock FROM variants ORDER BY variant_id DESC",(err, result, fields) => {
		arrayVariants = transformToArrayVariants(result);
		console.log(JSON.stringify(arrayVariants, null, 4));
	});
	//return arrayVariants;
}

function createArrayAll () {
	let arrayAll;
	let runStatus = 2;

	let arrayColors;
	let arrayVariants;
	
	checkRunStatus(createArrayColors(createArrayVariants));
	
	//checkRunStatus(1, createArrayColors);
	//checkRunStatus(2, createArrayVariants);	
		
	function checkRunStatus (callback) {
		callback;
		//runStatus += 1;
		if (runStatus === 2) {
			sql.query("SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product ", (err, result, fields) => {
				arrayAll = result;
				arrayAll = arrayAll.map((obj, index, array1) => {
					obj.sizes = obj.sizes.split(",");						//change sizes string to array
					obj.main_image = pathTransformNormal(obj.main_image);
					obj.images = obj.images.split(",");						//change images string to array
					obj.images = obj.images.map((item, index2, array2) => {
						return pathTransformNormal(item);
					});
					obj.colors = arrayColors[index].colors;
					obj.variants = arrayVariants[index];
					return obj;
				});
				console.log(arrayAll);
				//console.log(JSON.stringify(arrayAll,null,4));
				return arrayAll;
			});	
		}
	}
}
 */


/* ---------------Response Format--------------- */
//data format
function dataFormat (str) {
	str = {data: str};
	return JSON.stringify(str);
}

//error massage format
function errorFormat (str) {
	str = {error: str};
	return JSON.stringify(str);
}


/* ---------------Error--------------- */

//Catching 404 errors
app.use((req, res) => {
	res.status(404).send("Page not found.");
});

//Errors handler
app.use(function(err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});




/* ---------------Port--------------- */
app.listen(3000, () => {
	console.log("this app is running on port 3000.");
});