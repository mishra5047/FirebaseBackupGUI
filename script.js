let homeBtn = document.querySelector("#nextPage");
let takeBackup = document.querySelector("#takeBackup");

document.oncontextmenu = function() {
  return false;
}

homeBtn.addEventListener("click", function (e){
    window.location.assign("loginPage.html");
})

takeBackup.addEventListener("click", function (e){
  window.location.assign("loginPage.html");
})

let headerWaring = document.querySelector(".header_disc");
let close = document.querySelector("#close");

let isFirstTime = window.localStorage.getItem("isFirstTime");

if(isFirstTime != null){
  document.querySelector(".header_disc").remove();
}

if (headerWaring != null) {
  console.log("found");
    close.addEventListener("click", function (e) {
    document.querySelector(".header_disc").remove();
    window.localStorage.setItem("isFirstTime", "false");
  });
}

var activeItemSelector = "#item_1";

let item_1 = document.querySelector("#item_1");
let item_2 = document.querySelector("#item_2");
let item_3 = document.querySelector("#item_3");

item_1.addEventListener("click", function (e) {
  if (activeItemSelector == "#item_1") {
    //already active
  } else {
    document
      .querySelector(activeItemSelector)
      .classList.remove("active_list_item");
    item_1.classList.add("active_list_item");
    activeItemSelector = "#item_1";
  }
});

item_2.addEventListener("click", function (e) {
  if (activeItemSelector == "#item_2") {
    //already active
  } else {
    document
      .querySelector(activeItemSelector)
      .classList.remove("active_list_item");
    item_2.classList.add("active_list_item");
    activeItemSelector = "#item_2";
  }
});

item_3.addEventListener("click", function (e) {
  if (activeItemSelector == "#item_3") {
    //already active
  } else {
    document
      .querySelector(activeItemSelector)
      .classList.remove("active_list_item");
    item_3.classList.add("active_list_item");
    activeItemSelector = "#item_3";
  }
});

