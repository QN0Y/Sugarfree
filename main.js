var mongoose=require('mongoose');
var uri = 'mongodb://sugarfree:sugarfree1234@ds033760.mlab.com:33760/databasesugarfree';
mongoose.Promise = global.Promise;
mongoose.connect(uri);
var db = mongoose.connection;
var id;
var em;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection with database are establish");
});

//express js
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


var port = process.env.PORT||8080;
var router = express.Router();

app.use("/api", router);
app.listen(port);
console.log("server are running on " + port);


//patient schema
var PatientSchema = new mongoose.Schema({
	ID : String,
	Firstname: String,
	Lastname: String,
	Email: String,
	Password: String,
	Copassword: String,
	Birthday: String,
	gender: String
});

//blut zucker werte Schema
var BlutzuckerSchema = new mongoose.Schema({
	ID : String,
	Week : String,
	Monday : String,
	Tuesday : String,
	Wednesday : String,
	Thursday : String,
	Friday : String,
	Saturday : String,
	Sunday : String
});

var HealthdataSchema = new mongoose.Schema({
	ID : String,
	Weight : String,
	Height : String,
	Type : String,
	Therapie : String,
	Tablets : String,
	Bloodsugar : String,
	KH : String
});

var MealSchema = new mongoose.Schema({
	ID: String,
    monb: String,
    tueb: String,
    wedb: String,
    thub: String,
    frib: String,
    monl: String,
    tuel: String,
    wedl: String,
    thul: String,
    fril: String,
    mond: String,
    tued: String,
    wedd: String,
    thud: String,
    frid: String
});

var Patient = mongoose.model('Patient', PatientSchema);
var Blutzucker = mongoose.model('Blutzucker', BlutzuckerSchema);
var Healthdata = mongoose.model('Healthdata', HealthdataSchema);
var Mealplan = mongoose.model('Mealplan', MealSchema);

// Start
app.get('/', function(req, res, next){
	res.render('start.ejs', { meldung: ''});
});

// Signout
app.get('/signout', function(req, res, next){
	res.render('start.ejs',{ meldung: ''});
});

// Forward Measure
app.get('/fowardMeasure', function(req, res, next){
	res.render('measure.ejs');
});

// Forward Meal
app.get('/fowardMeal', function(req, res, next){

});

// Forward Signup
app.get('/fowardSignup', function(req, res, next){
	res.render('signup.ejs', { meldung: ''});
});

// Forward Signin
app.get('/fowardSignin', function(req, res, next){
	res.render('start.ejs',{ meldung: ''});
});

// Forward Dashboard
app.get('/fowardDashboard', function(req, res, next){
	res.render('dashboard.ejs',{
	 						monm : '',
							tuem : '',
							wedm : '',
							thum : '',
							frim : '',
							satm : '',
							sunm : '',
							week : '',
	 						});
});

app.post('/update', function(req, res, next){
	var w = req.body.navWeek;
	
	Blutzucker.find({ID:id,Week:w}, function(err, data) {
 		if (err) throw err;
 				// For value
	 			res.render('dashboard.ejs',{ 
					monm : data[0].Monday,
					tuem : data[0].Tuesday,
					wedm : data[0].Wednesday,
					thum : data[0].Thursday,
					frim : data[0].Friday,
					satm : data[0].Saturday,
					sunm : data[0].Sunday,
					week : w,
				});
	});
});

// Forward Profil
app.get('/fowardProfil', function(req, res, next){
	Healthdata.find({ID:id}, function(err, data) {
 		if (err) throw err;
	 			res.render('profil.ejs',{ 
		 		weight: data[0].Weight,
		 		height: data[0].Height,
		 		type: data[0].Type,
		 		therapie: data[0].Therapie,
		 		tablets: data[0].Tablets,
		 		bloodsugar: data[0].Bloodsugar,
		 		kh: data[0].KH
				});
	});
});	


// Forward Edit Profile
app.get('/fowardEditProfil', function(req, res, next){
	Healthdata.find({ID:id}, function(err, data) {
 		if (err) throw err;
 				// For value
	 			res.render('editP.ejs',{ 
		 		weight: data[0].Weight,
		 		height: data[0].Height,
		 		type: data[0].Type,
		 		therapie: data[0].Therapie,
		 		tablets: data[0].Tablets,
		 		bloodsugar: data[0].Bloodsugar,
		 		kh: data[0].KH
				});
	});
});

// meal
app.get('/meal', function(req, res) {
	var rnd = Math.floor(Math.random() * 2) + 1;
	Mealplan.find({ID:rnd}, function(err, data) {
		res.render('mealPlan.ejs',{
				monb : data[0].monb,
				tueb : data[0].tueb,
				wedb : data[0].wedb,
				thub : data[0].thub,
				frib : data[0].frib,
				monl : data[0].monl,
				tuel : data[0].tuel,
				wedl : data[0].wedl,
				thul : data[0].thul,
				fril : data[0].fril,
				mond : data[0].mond,
				tued : data[0].tued,
				wedd : data[0].wedd,
				thud : data[0].thud,
				frid : data[0].frid,
	});
	});
});


// Signin
app.post('/signin', function(req, res){
	var email = req.body.startUsername;
	var password = req.body.startPassword;

			Patient.findOne({Email:email, Password: password}, function(err, patient){
		  		if(err){
		   			console.log(err);
		   			return res.sendStatus(500).send();
		  		}

		  		if(!patient){
		   			console.log("Patient with "+ email+ " " + password+ " do not exist!!");
		  		 	res.render('start', { meldung: '* Your email or password are not correct'});
		  		}
		  		else
		  		{
		  			Patient.find({Email:email}, function(err, patient) {
 						if (err)
 							throw err;
 						id = patient[0].ID;
 						console.log("User with ID : " + id + " logged in");
	 					res.render('dashboard.ejs',{
	 						monm : '',
							tuem : '',
							wedm : '',
							thum : '',
							frim : '',
							satm : '',
							sunm : '',
							week : '',
	 						});
					});
		  		}
			});
});

 			


// Signup
app.post('/signup', function(req, res){
	
	var firstname = req.body.signupFirstname;
	var lastname = req.body.signupLastname;
	var email = req.body.signupEmail;
	var password = req.body.signupPassword;
	var copassword = req.body.signupCoPassword;
	var birthday = req.body.signupBirthday;
	var gender = req.body.signupGender;
	var rnd = Math.floor(Math.random() * 100);

		var newPatient = new Patient({
		ID: rnd,
		Firstname: firstname,
		Lastname: lastname,
		Email: email,
		Password: password,
		Birthday: birthday,
		gender: gender
		});
		
		newPatient.save(function(err, newPatient){
		if(err) return console.error(err);
		console.log("new user are succesfull to database added");	
		});

		id = rnd;
		res.render('createP.ejs');
		
});

// create profile
app.post('/createprofil', function(req, res){
	
	var weight = req.body.createWeight;
	var height = req.body.createHeight;
	var type = req.body.createType;
	var therapie = req.body.createTherapie;
	var tablets = req.body.createTablets;
	var bloodsugar = req.body.createBlood;
	var kh = req.body.createkh;
	
	var newHealthdata = new Healthdata({
	ID : id,
	Weight : weight,
	Height : height,
	Type : type,
	Therapie : therapie,
	Tablets : tablets,
	Bloodsugar : bloodsugar,
	KH : kh
	});
	
	newHealthdata.save(function(err, newHealthdata){
	if(err) return console.error(err);
	console.log("User with ID : " + id + " has been added a new profile");
	});
	
	create_report();

	res.render('dashboard.ejs',{
	 						monm : '',
							tuem : '',
							wedm : '',
							thum : '',
							frim : '',
							satm : '',
							sunm : '',
							week : '',
	 });

});

// Measure
app.post('/measure', function(req, res) {
	var w = req.body.measureWeek;
	var d = req.body.measureDay;
	var bz = req.body.measureBlood;

	switch(d) {
		case "monday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Monday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;
		case "tuesday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Tuesday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;
		case "wednesday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Wednesday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;
		case "thursday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Thursday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;
		case "friday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Friday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;
		case "saturday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Saturday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;
		case "sunday":
		Blutzucker.update ({ ID : id, Week : w }, { $set : { Sunday: bz}}, function( err, result ) {if ( err ) throw err;});
		break;

	}
	

	
	
	console.log("User with ID : " + id + " has been added a new measure");
		res.render('dashboard.ejs',{
	 						monm : '',
							tuem : '',
							wedm : '',
							thum : '',
							frim : '',
							satm : '',
							sunm : '',
							week : '',
	 });

});

// Measure
app.post('/edit', function(req, res) {
	var weight = req.body.editWeight;
	var height = req.body.editHeight;
	var type = req.body.editTyp;
	var therapie = req.body.editTherapie;
	var tablets = req.body.editTablets;
	var bloodsugar = req.body.editBlood;
	var kh = req.body.editkh;
		
	Healthdata.update (
    { ID : id },
    { $set : { 
    	Weight:weight,
		Height : height,
		Type : type,
		Therapie : therapie,
		Tablets : tablets,
		Bloodsugar : bloodsugar,
		KH : kh
    }},
    function( err, result ) {
        if ( err ) throw err;
    }
	);

	console.log("User with ID : " + id + " changed the profile");
		res.render('dashboard.ejs',{
	 						monm : '',
							tuem : '',
							wedm : '',
							thum : '',
							frim : '',
							satm : '',
							sunm : '',
							week : '',
	 });

});

function email_validate(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function name_validate(name) {
	return name.match(/\d+/g);
}

function create_report() {
	var w1 = new Blutzucker({
		ID : id,
		Week : 'Week 1',
		Monday : '',
		Tuesday : '',
		Wednesday : '',
		Thursday : '',
		Friday : '',
		Saturday : '',
		Sunday : ''
		});

	w1.save(function(err, data){
	if(err) return console.error(err);
	console.log("User with ID : " + id + " has been create W1 report");
	});

	var w2 = new Blutzucker({
		ID : id,
		Week : 'Week 2',
		Monday : '',
		Tuesday : '',
		Wednesday : '',
		Thursday : '',
		Friday : '',
		Saturday : '',
		Sunday : ''
		});

	w2.save(function(err, data){
	if(err) return console.error(err);
	console.log("User with ID : " + id + " has been create W2 report");
	});

	var w3 = new Blutzucker({
		ID : id,
		Week : 'Week 3',
		Monday : '',
		Tuesday : '',
		Wednesday : '',
		Thursday : '',
		Friday : '',
		Saturday : '',
		Sunday : ''
		});

	w3.save(function(err, data){
	if(err) return console.error(err);
	console.log("User with ID : " + id + " has been create W3 report");
	});

	var w4 = new Blutzucker({
		ID : id,
		Week : 'Week 4',
		Monday : '',
		Tuesday : '',
		Wednesday : '',
		Thursday : '',
		Friday : '',
		Saturday : '',
		Sunday : ''
		});

	w4.save(function(err, data){
	if(err) return console.error(err);
	console.log("User with ID : " + id + " has been create W4 report");
	});

}









