let dt = document.querySelector(".time");
setInterval(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2)
  const date =  ("0" + now.getDate()).slice(-2);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  dt.innerText = `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}, 1000);
