const mongoose = require("mongoose");
const Announcement=require("./models/announcementSchema.js");

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

// Define 10 school announcements
const announcements = [
    { announcement: "School will be closed next Monday for a public holiday." },
    { announcement: "Parent-teacher conferences are scheduled for next Wednesday." },
    { announcement: "The school science fair will be held on August 20th." },
    { announcement: "Summer vacation starts on June 15th and ends on August 31st." },
    { announcement: "New student orientation is on July 1st at 10:00 AM." },
    { announcement: "The annual sports day is on September 10th." },
    { announcement: "Please submit all library books by May 30th for the end-of-year inventory." },
    { announcement: "The school play will be performed on April 25th at 6:00 PM." },
    { announcement: "Report cards will be distributed on December 20th." },
    { announcement: "The school cafeteria will be offering new healthy meal options starting next week." }
];

// Insert announcements into the database
Announcement.deleteMany({}).then((res)=>{
    console.log("Empty the garbage data before adding new data");
});
Announcement.insertMany(announcements)
    .then(docs => {
        console.log("Announcements inserted:", docs);
        mongoose.connection.close(); // Close the connection after inserting
    })
    .catch(err => {
        console.error("Error inserting announcements:", err);
    });
