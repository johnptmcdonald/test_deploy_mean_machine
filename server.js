var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var config = require('./config')

var User = require('./app/models/user.js')

mongoose.connect(config.database)

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
})

app.use(morgan('dev'))

// ROUTES
app.get('/', function(req, res){
	res.send('Welcome to the home page!');
})

// API ROUTES
var apiRouter = express.Router();

// API middleware
apiRouter.use(function(req, res, next){
	console.log("Somebody just came to our app");
	// authenticate users here, in the middleware!
	next();
})

// first test route
apiRouter.get('/', function(req,res){
	res.json({message: "['hip, 'hip'], welcome to our api!"})
})

// api/users routes
apiRouter.route('/users')
	// create a new user

	.get(function(req, res){
		console.log("getting users")
		res.json({message: "users are here!"})
	})

	.post(function(req, res){
		console.log("posting")
		console.log(req.body)
		// create a new instance of the User model
		var user = new User();

		// set the user's information from the req params
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		// save the user and check for errors
		user.save(function(err){
			if(err){
				// duplicate entry
				if(err.code == 11000){
					return res.json({success: false, message: "A user with that username already exists"});
				} 
			}else {
					return res.send({message: "success!"})
			}
		})
	})




app.use('/api', apiRouter);


app.listen(port)
console.log("magic happens on port " + port);





