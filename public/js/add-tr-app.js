let formmessage=document.querySelector(".form-message");
let closeBtn=document.querySelector(".form-message .form-message-content .close-btn button");

closeBtn.addEventListener("click",()=>{
    formmessage.classList.add("none");
})
console.log("working");