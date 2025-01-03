const mongoose=require("mongoose");

const studentSchema=new mongoose.Schema({
    studentName:{
        type:String,
        required:true,
        trim:true,
        uppercase:true
    },
    userid:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    dob:{
        type:Date,
        required:true,
        validate: {
            validator: function(value) {
                const twentyYearsAgo = new Date();
                twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 18);
                return value <= twentyYearsAgo;
            },
            message: 'Date of birth must be at least 18 years old.'
        }
    },
    stuemail:{
        type:String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    gender:{
        type:String,
        required:true
    },
    Branch:{
        type:String,
        required:true
    },
    Section:{
        type: String,
        required: true,
    },
    Semester:{
        type: String,
        required: true,
    },
    contact:{
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
    Address:{
        type:String,
        maxLength:20
    }

})

const Student=mongoose.model("Student",studentSchema);

module.exports=Student;
