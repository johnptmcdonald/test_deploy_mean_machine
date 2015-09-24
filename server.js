var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

var User = require('./app/models/user.js')

mongoose.connect(process.env.MONGOLAB_URI)

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
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
	.post(function(req, res){
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
				} else {
					return res.send(err)
				}
			}
		})
	})




app.use('/api', apiRouter);


app.listen(port)
console.log("magic happens on port " + port);





