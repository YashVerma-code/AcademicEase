const mongoose=require("mongoose");

const attendenceSchema=new mongoose.Schema({
    studentName:{
        type:String,
        required:true,
        trim:true,
        uppercase:true
    },
    userid:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
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
    DateOfAttn:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        required:true
    }

});

const Attendence=mongoose.model("Attendence",attendenceSchema);

module.exports=Attendence;
