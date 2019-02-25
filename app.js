/* ---------------Module--------------- */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer  = require('multer');
const mysql = require('mysql2');
const Client = require('ssh2').Client;

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


//create TCP connection to MySQL over SSH by using mysql2 and ssh2 module
var sql;	//can't use const

const ssh = new Client();
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
			sql.query("SELECT id FROM product", function (err, result, fields) {
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




/* ---------------Route--------------- */
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

app.get("/admin/checkout.html",(req, res) => {
	res.render("checkout");
});


/* ---------------Poduct API 1.0--------------- */
//product input form
app.post("/api/1.0/admin/product", upload.fields([{name: "mainImage", maxCount: 1}, {name: "images", maxCount: 50}]), (req, res) => {
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
	sql.query(`INSERT INTO product (product_id, title, category, description, price, texture, wash, place, note, story, color_codes, color_names, sizes, main_image_path, other_images_path) VALUES ('${productId}', '${title}', '${category}', "${description}", "${price}", "${texture}", "${wash}", "${place}", "${note}", "${story}", "${colorCodes}", "${colorNames}", "${sizes}", "${mainImagePath}", "${imagesPath}")`, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted(table product), ID: " + result.insertId);
	});
	
	
	//Insert variants table
	let productType = 1;

	const arrayOfColorCodes = colorCodes.split(",");
	const arrayOfColorNames = colorNames.split(",");
	const arrayOfSizes = sizes.split(",");
	const arrayOfVariants = [];


	if (arrayOfColorCodes.length != arrayOfColorNames.length){
		console.log("color_codes != color_names.");
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
		});
	}
		
	//console.log(req.body);
	res.redirect("/admin/product.html");
	
});



//Product List API
app.get("/api/1.0/products/search", async(req, res) => {
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

		if (isNaN(paging)) {
			paging = 0;
		}

		itemStartNum = paging*itemNumPerPage;
		
		arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product WHERE (product_id LIKE '%${keyword}%' OR title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%') LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
		arrayColors = transformToArrayColors(arrayColors);
		
		let temp = await sqlQuery(`SELECT product_id FROM product WHERE (product_id LIKE '%${keyword}%' OR title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%')`);
		temp = temp.reduce((accumulator,currentValue) => {
			//console.log(accumulator,"\n",currentValue.product_id);
			accumulator += "," + `"${currentValue.product_id}"`;
			return accumulator;
		},`"${temp[0].product_id}"`);
		//console.log(temp);
		//console.log(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id IN (${temp}) ORDER BY variant_id DESC`);
		let result1 = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id IN (${temp}) ORDER BY variant_id DESC`);
		//console.log(result1);
		result1 = transformToArrayVariants(result1);
		for (let i=itemStartNum ; i < (itemStartNum + itemNumPerPage) ;i++) {
			arrayVariants.push(result1[i]);
		};
		
		arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product WHERE (product_id LIKE '%${keyword}%' OR title LIKE '%${keyword}%' OR description LIKE '%${keyword}%' OR price LIKE '%${keyword}%' OR texture LIKE '%${keyword}%' OR wash LIKE '%${keyword}%' OR place LIKE '%${keyword}%' OR story LIKE '%${keyword}%' OR color_codes LIKE '%${keyword}%' OR color_names LIKE '%${keyword}%' OR sizes LIKE '%${keyword}%') LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
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

app.get("/api/1.0/products/details", async (req, res) => {
	let objectFin;
	let arrayColors;
	let arrayVariants = [];
	let arrayAll;
	let id = req.query.id;
	console.log(id);
	
	try{
		//check id exist or not
		let num = await sqlQuery(`SELECT COUNT(*) FROM product WHERE product_id = "${id}"`);
		num = num[0]["COUNT(*)"];
		console.log(num);
		
		if (num != 0) {
			arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product WHERE product_id = "${id}"`);
			arrayColors = transformToArrayColors(arrayColors);

			arrayVariants = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id = "${id}" ORDER BY variant_id DESC`);
			arrayVariants = transformToArrayVariants(arrayVariants);

			arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product WHERE product_id = "${id}"`);
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
			objectFin = {data: arrayAll[0]};
			//console.log(arrayAll);
			console.log(JSON.stringify(objectFin,null,4));
			
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
});

app.get("/api/1.0/products/:category", async(req, res) => {			//this route must under other products/ end point route
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
			console.log(1);
			if (isNaN(paging)) {
				paging = 0;
			}

			itemStartNum = paging*itemNumPerPage;
			
			arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
			arrayColors = transformToArrayColors(arrayColors);
			
			let result1 = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants ORDER BY variant_id DESC`);
			result1 = transformToArrayVariants(result1);
			for (let i=itemStartNum ; i < (itemStartNum + itemNumPerPage) ;i++) {
				arrayVariants.push(result1[i]);
			};
			
			arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
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
			
			//check total item num
			totalItemNum = await sqlQuery(`SELECT COUNT(*) FROM product`);
			totalItemNum = totalItemNum[0]["COUNT(*)"];
			console.log(totalItemNum);
			
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
			console.log(2);
			if (isNaN(paging)) {
				paging = 0;
			}

			itemStartNum = paging*itemNumPerPage;
			
			arrayColors = await sqlQuery(`SELECT color_codes, color_names FROM product WHERE category = "${category}" LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
			arrayColors = transformToArrayColors(arrayColors);
			
			let temp = await sqlQuery(`SELECT product_id FROM product WHERE category = "${category}"`);
			temp = temp.reduce((accumulator,currentValue) => {
				//console.log(accumulator,"\n",currentValue.product_id);
				accumulator += "," + `"${currentValue.product_id}"`;
				return accumulator;
			},`"${temp[0].product_id}"`);
			
			let result1 = await sqlQuery(`SELECT product_id AS id, product_type, color_code, size, stock FROM variants WHERE product_id IN (${temp}) ORDER BY variant_id DESC`);
			result1 = transformToArrayVariants(result1);
			for (let i=itemStartNum ; i < (itemStartNum + itemNumPerPage) ;i++) {
				arrayVariants.push(result1[i]);
			};
			
			arrayAll = await sqlQuery(`SELECT product_id AS id, title, description, price, texture, wash, place, note, story, sizes, main_image_path AS main_image, other_images_path AS images FROM product WHERE category = "${category}" LIMIT ${itemNumPerPage} OFFSET ${itemStartNum}`);
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
			
			//check total item num
			totalItemNum = await sqlQuery(`SELECT COUNT(*) FROM product WHERE product_id IN (${temp})`);
			totalItemNum = totalItemNum[0]["COUNT(*)"];
			console.log(totalItemNum);
			
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

/* app.get("/api/1.0/products/women", (req, res) => {
	res.send("women");
});

app.get("/api/1.0/products/men", (req, res) => {
	res.send("men");
});

app.get("/api/1.0/products/accessories", (req, res) => {
	res.send("accessories");
}); */






//Use Promise for MySQL .query()
function sqlQuery (query1) {
	return new Promise ((reso, rej) => {
		sql.query(query1,(err, result, fields) => {
			if (err) {
				rej(err);
			}
			else {
				reso(result);
			}
		});
	});
};

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