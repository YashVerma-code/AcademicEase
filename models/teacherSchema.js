const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// passport-local-mongooswe bydefault add a username and password -- with hash and salt field to store the username and password
const passportLocalMongoose=require("passport-local-mongoose");


const teacherSchema=new mongoose.Schema({
    tname:{
        type:String,
        required:true,
        trim:true,
        uppercase:true
    },
    tdob:{
        type:Date,
        required:true,
        validate: {
            validator: function(value) {
                // Calculate the date that is 20 years before today
                const twentyYearsAgo = new Date();
                twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
                // Check if the date of birth is before or equal to the calculated date
                return value <= twentyYearsAgo;
            },
            message: 'Date of birth must be at least 20 years old.'
        }
    },
    temail:{
        type:String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    gen:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    tcontact:{
        type: String,
        required: true,
        validate: [
            {
                validator: function(v) {
                    return /\d{10}/.test(v); // Validate that the contact number is exactly 10 digits
                },
                message: props => `${props.value} is not a valid 10-digit number!`
            },
            {
                validator: function(v) {
                    return v.length === 10; // Ensure the length is exactly 10 characters
                },
                message: props => `Contact number must be exactly 10 digits long!`
            }
        ]
    },
    taddress:{
        type:String,
        maxLength:20
    }
    
})

teacherSchema.plugin(passportLocalMongoose);
const Teacher=mongoose.model("Teacher",teacherSchema);

module.exports=Teacher;



