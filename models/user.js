var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String,
	favorite_teacher: {type:String,
						default: "None"},
	tokens :[
		{
			token : {
				type : String,
				default:"None",
				required:true   
			}
		}
	]
})



User = mongoose.model('users', userSchema);

module.exports = User;