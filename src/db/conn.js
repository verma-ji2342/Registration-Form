const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://pranjalverma1122:SXWhajWHlezPm1QV@cluster0.md3h44l.mongodb.net/pranjal").then (()=> {
    console.log(`connection successfull`);
}).catch((e) => {
    console.log(`no connection`);
})