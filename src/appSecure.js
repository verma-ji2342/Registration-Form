require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const port = process.env.port || 3000;
require("./db/conn");
const Register = require("./models/registers");
const bcrypt = require("bcryptjs");


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res)=> {
    res.render("index");
})

app.post("/", async(req, res) => {
    try {
        // console.log(req.body.fname);
        // res.send(req.body.fname);
        const p1 = req.body.password;
        const p2 = req.body.Cpassword;
        if(p1 != p2){
            res.send("Password Does not Match");
        }
        else{
            const RegisterEmployee = new Register({
                firstname : req.body.fname,
                lastname : req.body.lname,
                email : req.body.gmail, 
                gender : req.body.gender,
                phone : req.body.phoneno,
                age : req.body.age,
                password : p1,
                confirmpassword: p2
            })

            console.log("the success part "+RegisterEmployee);
            const token = await RegisterEmployee.generateAutoToken();
            console.log("the token part : "+token);

            const registered  = await RegisterEmployee.save();
            console.log("the page part" + registered);
            res.status(201).render("index");
        }
    }
    catch(e){
        res.status(400).send(e);
    }
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async(req, res) => {
    try{
        const email = req.body.email;
        const pass = req.body.password;

        const username = await Register.findOne({email:email});
        const check = await bcrypt.compare(pass, username.password);

        const token = await username.generateAutoToken();
        console.log("the token part : "+token);


        if(check){
            res.send("Login successfully :)")
        }
        else{
            res.send("password is invalid");
        }
        console.log(username);
    }catch(e){
        res.status(400).send("Invalid email or password");
    }
})



// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({id_: "652bc308f25be80b3be2e2f4"}, "mynameispranjalvermacinematographer", {expiresIn : "1 minute"});
//     console.log(token);

//     const userVer = await jwt.verify(token, "mynameispranjalvermacinematographer");
//     console.log(userVer);
// }
// createToken();


app.listen(port ,()=>{
    console.log(`server is running at port no ${port}`);
})