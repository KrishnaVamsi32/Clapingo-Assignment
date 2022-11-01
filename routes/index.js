var express = require('express');
var router = express.Router();
var User = require('../models/user');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate')
const app = express();
require("../db/aggregation")

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;

	//verifying user registered info

	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
		} else {
			if (personInfo.password == personInfo.passwordConf) {

				User.findOne({email:personInfo.email},function(err,data){
					if(!data){
						var c;
						User.findOne({},function(err,data){

							if (data) {
								console.log("if");
								c = data.unique_id + 1;
							}else{
								c=1;
							}

							var newPerson = new User({
								unique_id:c,
								email:personInfo.email,
								username: personInfo.username,
								password: personInfo.password,
								passwordConf: personInfo.passwordConf
							});

							newPerson.save(function(err, Person){
								if(err)
									console.log(err);
								else
									console.log('Success');
							});

						}).sort({_id: -1}).limit(1);
						res.send({"Success":"You are registered,You can login now."});
					}else{
						res.send({"Success":"Email is already used."});
					}

				});
			}else{
				res.send({"Success":"password does  not matched"});
			}
		}
});


// login authentication
app.post("/login",authenticate,(req,err)=>{
	res.redirect("/profile")
})
router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

// verifying login details and generating JsonWebToken 
router.post('/login', function (req, res, next) {

		User.findOne({email:req.body.email},function(err,data){
			console.log("####################################################")
			console.log("Profile : ")
			if(data){
			console.log("Data")
			if(data.password==req.body.password){
				
				req.session.userId = data.unique_id;
				const token = jwt.sign({_id : data.unique_id}, process.env.SECRET_KEY)
        		data.tokens = data.tokens.concat({token : token});
				data.save()
				console.log(data)
				res.cookie('jwtoken', token, {
					expires : new Date(Date.now() + 25892000000 ),
					httpOnly: true
					});

				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not registered!"});
		}
	});
});



router.get('/profile', function (req, res, next) {
	User.findOne({unique_id:req.session.userId},function(err,data){
		if(!data){
			res.redirect('/');
		}else{
			return res.render('data.ejs', {"name":data.username,"email":data.email,"favorite_teacher":data.favorite_teacher});
		}
	});
});

// profile authentication 
app.post("/profile",authenticate,(req,err)=>{
	res.redirect("/profile")
})

// When student changes his/her favorite teacher, the field in database is modified here
router.post('/profile', function (req, res) {
	const x = req.body.fav_teacher;
	User.findOne({unique_id:req.session.userId}, async function(err,data){
		
			if(!data){
			res.redirect('/');
			}else{
				await User.updateOne({_id:data._id},{$set:{favorite_teacher: x}},function(err,code){
				if(err){
					console.log(err)
				}
				else{
					console.log("Changed favorite teacher to : ",x)
					
				}
			})
			res.redirect('/profile')
		}
			
	});
});

// logout route
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});


//forget password route
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});


module.exports = router;