const express=require("express");
const path=require("path");
const app=express();
const port =8080;
const methodOverride=require("method-override");
const session=require("express-session");

const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local").Strategy;


const wrapAsync=require("./utils/wrapAsyc.js");

const ExpressError=require("./utils/ExpressError.js");


const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}

const mongoose=require("mongoose");
// const bcrypt = require('bcrypt');

// models
const Teacher=require("./models/teacherSchema.js");
const Student=require("./models/studentSchema.js");
const Attendence=require("./models/attendenceSchema.js");
const Announcement=require("./models/announcementSchema.js");

// routes
// const teacherRoute=require("./routes/teacher.js");
// const student=require("./routes/student.js");





main()
.then((res)=>{
    console.log("Connection successful");
})
.catch((err)=>{
    console.log("Error Occured due to "+err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/academicEase");
}


app.set("view engine","ejs"); //important for ejs files.
app.set("views",path.join(__dirname,"/views"));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true})); //to make the data readable of body part



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
// To initialize passport
app.use(passport.session());


passport.use(new LocalStrategy(Teacher.authenticate()));

passport.serializeUser(Teacher.serializeUser());

passport.deserializeUser(Teacher.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.use("teacher",teacherRoute);


app.listen(port,(req,res)=>{
    console.log(`Server is listening at port ${port}`);
})

// Routes
app.get("/",(req,res)=>{
    res.render("teacher/login.ejs");
})

app.post("/registerteacher", wrapAsync(async (req,res,next) => {
    try{
        let {username,password,tname,tdob,temail,gen,qualification,tcontact,taddress}=req.body;
        
        const newUser =new Teacher({tname:tname,tdob:tdob,temail:temail,gen:gen,qualification:qualification,tcontact:tcontact,taddress:taddress,username:username});
        
        console.log(req.body);
        const registeredUser=await Teacher.register(newUser,password);

        console.log(registeredUser);

        req.log(registeredUser,err=>{
            if(err){
                return next(err);
            }
        req.flash("success","Successfully Registered!");
        res.redirect("/registerteacher");
        });
    }catch(err){
        console.log(err);
        req.flash("error",err.message);
        res.redirect("/registerteacher");
    }
})
);


app.post("/teacher/addStudent",async(req,res)=>{
    let success=0;
    const obj=req.body;
    const newStudent = new Student({
        studentName:obj.stuname,
        userid:obj.user,
        dob:obj.studob,
        stuemail:obj.stuemail,
        gender:obj.gen,
        Branch:obj.branch,
        Section:obj.section,
        Semester:obj.semester,
        contact:obj.stucontact,
        Address:obj.stuaddress
    });
    let errMsg="";
    if(obj.pass!=obj.cpass){
        errMsg="Password Don't match"
    }else{
        newStudent.password=obj.pass;
    }

    try {
        await newStudent.save();
        console.log("Added to the database")
        req.flash("success","Successfully Registered!");
        res.render("teacher/add-stn.ejs");
    } catch (err) {
        errMsg="Weak connection! Data not added";
        console.log('Error: ' + err);
        req.flash("Error","Something went wrong !");
        res.render("teacher/add-stn.ejs");
    }
})


app.post("/teacher",
    passport.authenticate("local" ,{failureRedirect:"/",failureFlash:true}),
    async(req,res,next)=>{
        try{
            req.flash("success","Welcome to AcademicEase! You are logged in.");
            console.log(req.user);
            res.render("teacher/teacherHome.ejs",{teacher:req.user});
        }catch(err){
            req.flash("error",err.message);
            req.redirect("/teacher");
        }
})


app.get("/teacher",(req,res)=>{
    res.render("teacher/teacherHome.ejs");
})


app.get("/teacher/announcement",async(req,res)=>{
    let announcements=await Announcement.find({});
    res.render("teacher/announcement.ejs",{announcements});
})


app.get("/teacher/allstudent",(req,res)=>{
    res.render("teacher/all-student.ejs");
})


app.get("/teacher/allstudent/allstudentinfo",async(req,res)=>{
    let {semester,branch,section}=req.query;
    console.log(req.query);
    console.log(semester,branch,section);
    // console.log(allStudns);
    let allStudns=await Student.find({Semester:semester,Branch:branch,Section:section});
    res.render("teacher/all-student-info.ejs",{allStudns});
})


app.get("/teacher/attendence",(req,res)=>{
    res.render("teacher/attendence.ejs");
})


app.get("/registerteacher",(req,res)=>{
    res.render("teacher/add-tr.ejs");
})


app.post("/teacher/announcement",async(req,res)=>{
    let {announcement}=req.body;
    await Announcement({announcement:announcement}).save();
    res.redirect("/teacher/announcement");
})

app.get("/teacher/:id/information",async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let teacherinfo=await Teacher.findOne({_id:id});
    console.log(teacherinfo);
    res.render("teacher/teacher-info.ejs",{teacherinfo});
})

app.get("/teacher/:id/information/edit",async(req,res)=>{
    let {id}=req.params;
    let teacher=await Teacher.findOne({_id:id});
    res.render("teacher/teacher-info-edit.ejs",{teacher});
    
})

app.post("/teacher/attendence/attendence_sheet",async(req,res)=>{
    let {branch,semester,section}=req.body;
    let allstudent=await Student.find({Branch:branch,Section:section,Semester:semester});
    res.render("teacher/attendenceSheet.ejs",{allstudent});
})

app.post("/teacher/attendence/attendence_sheet/addAttendence", async (req, res) => {
    let { attndate, attn } = req.body;
    
    try {
        // Get unique student details for the given branch, section, and semester after processing all attendance updates.
        let studentsDetails = {};

        await Promise.all(Object.keys(attn).map(async (key) => {
            try {
                let student = await Student.findOne({ userid: key });

                if (!student) {
                    throw new Error(`Student with userid: ${key} not found`);
                }

                studentsDetails = {
                    Branch: student.Branch,
                    Section: student.Section,
                    Semester: student.Semester
                };

                await Attendence.updateOne(
                    { userid: key, DateOfAttn: attndate },
                    {
                        studentName: student.studentName,
                        userid: key,
                        Branch: student.Branch,
                        Section: student.Section,
                        Semester: student.Semester,
                        DateOfAttn: attndate,
                        status: attn[key]
                    },
                    { upsert: true }  // This will insert the document if it doesn't exist
                );
            } catch (error) {
                console.error(`Error updating/inserting attendance for userid: ${key} - ${error}`);
            }
        }));

        // Fetch all students after all attendance updates are done
        let allstudent = await Student.find({
            Branch: studentsDetails.Branch,
            Section: studentsDetails.Section,
            Semester: studentsDetails.Semester
        });

        res.render("teacher/attendenceSheet.ejs", { allstudent });
    } catch (error) {
        console.error(`Error processing attendance: ${error}`);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/teacher/attendence/attendence_sheet_view",(req,res)=>{
    res.render("teacher/attendenceviewdate.ejs")
})

app.get("/teacher/attendence/attendence_sheet_view/date",(req,res)=>{
    res.render("teacher/attendenceview.ejs")
})

app.get("/teacher/addStudent",(req,res)=>{
    res.render("teacher/add-stn.ejs",{success:0})
})

app.get("/teacher/allstudent/allstudentinfo/:userid",async(req,res)=>{
    let {userid}=req.params;
    // console.log(userId);
    // console.log(student);
    let student=await Student.findOne({userid:userid});
    res.render("teacher/stn-info.ejs",{student});
})

app.get("/teacher/result",(req,res)=>{
    res.render("teacher/stud-result-home.ejs");
})

app.get("/teacher/result/classresult",(req,res)=>{
    res.render("teacher/class-result.ejs");
})

app.get("/teacher/result/classresult/studentresult",(req,res)=>{
    res.render("teacher/student-result.ejs");
})

app.get("/student",(req,res)=>{
    res.render("student/studentHome.ejs");
})

app.post("/student",async(req,res)=>{
    let {userid,password,branch}=req.body;
    let student=await Student.findOne({userid:userid,password:password,Branch:branch});
    // console.log(student);
    res.render("student/studentHome.ejs",{student});
})

// Announcement page
app.get("/student/announcement",async(req,res)=>{
    let announcements=await Announcement.find({});
    res.render("student/announcement.ejs",{announcements});
})

// student attendence
app.get("/student/:userid/attendence",async(req,res)=>{
    let {userid}=req.params;
    let student= await Student.findOne({userid:userid});
    res.render("student/attendence.ejs",student);
})

// go to update password page.
app.get("/student/:userid/updatepassword",async(req,res)=>{
    let{userid}=req.params;
    let student=await Student.findOne({userid:userid});
    res.render("student/update-pass.ejs",{student});
})

// Update password
app.put("/student/:id/updatepassword",async(req,res)=>{
    let {id}=req.params;
    let{oldPass,newPass,newCpass}=req.body;
    let student=await Student.findOne({userid:id});

    console.log(student);
    if(student.password==oldPass){
        let updatedPass=await Student.findOneAndUpdate({userid:id},
            {
                password:newPass,
            },
            {
                runValidators:true,
                new:true
        });
        console.log("Password changed");
        res.render("student/update-pass.ejs",{student});
    
    }else{
        res.send("Password did not match");
    }
})


app.get("/student/allstudent/:id",async(req,res)=>{

    let {id}=req.params;
    let studn=await Student.findOne({userid:id});
    let {Semester,Branch,Section}=studn;
    let allStudns=await Student.find({Semester:Semester,Branch:Branch,Section:Section});
    res.render("teacher/all-student-info.ejs",{allStudns});
})

app.get("/student/:userId/information",async(req,res)=>{
    let {userId}=req.params;
    console.log(userId);
    let student=await Student.findOne({userid:userId});
    console.log(student);
    res.render("teacher/stn-info.ejs",{student});
})

//announcement delete 
app.delete("/announcement/:announcid",async(req,res)=>{
    let{announcid}=req.params;
    await Announcement.findByIdAndDelete(announcid);
    res.redirect("/teacher/announcement");
})

// student delete
app.delete("/allstudent/allstudentinfo/:userid",async(req,res)=>{
    let{userid}=req.params;
    let student=await Student.findOne({userid:userid});

    await Student.deleteOne({ userid: userid });
    let url=`http://localhost:8080/teacher/allstudent/allstudentinfo?semester=${student.Semester}&branch=${student.Branch}&section=${student.Section}`;
    console.log(url);
    res.redirect(url);
    // setTimeout(()=>{
    // },5000);
    
})

app.all("*",(req,res)=>{
    res.render("includes/error.ejs");
})