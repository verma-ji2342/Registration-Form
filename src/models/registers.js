require('dotenv').config();
const mongoose = require("mongoose");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname : {
        type:String, 
        require:true
    },
    lastname : {
        type:String,
        require:true
    },
    email : {
        type:String,
        require:true,
        unique:true
    }, 
    gender : {
        type:String, 
        require:true
    },
    phone : {
        type:Number, 
        require:true,
        unique:true
    }, 
    age : {
        type:Number,
        require:true
    },
    password : {
        type:String,
        require:true
    }, 
    confirmpassword : {
        type:String,
        require:true
    },
    tokens : [{
        token : {
            type: String,
            require : true
        }
    }]
});

employeeSchema.methods.generateAutoToken = async function(){
    console.log("sdbjbsd");
    try{
        console.log(this._id);
        const token = await jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : token});
        await this.save();
        // console.log("save ho gya ");
        return token;
    }catch(error) {
        res.send("the error part "+error);
        console.log("the error part "+error);
    }
}

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        console.log(this.password);
        this.password = await becrypt.hash(this.password, 10);
        console.log(this.password);
    }
    next();
})


const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register