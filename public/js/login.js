let stnLogin=document.querySelector(".stnLogin");
let trLogin=document.querySelector(".trLogin");
let stdn=document.querySelector(".login-stn")
let tr=document.querySelector(".login-tr");

stnLogin.addEventListener("click",()=>{
    stnLogin.classList.add("bg-active");
    trLogin.classList.remove("bg-active");
    stdn.classList.remove("Deactive");
    tr.classList.add("Deactive");

})
trLogin.addEventListener("click",()=>{
    trLogin.classList.add("bg-active");
    stnLogin.classList.remove("bg-active");
    stdn.classList.add("Deactive");
    tr.classList.remove("Deactive");
})