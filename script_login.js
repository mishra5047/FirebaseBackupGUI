/*
input fields code taken from => 
https://codemyui.com/input-field-label-wave-animation-on-click/
*/

document.oncontextmenu = function() {
  return false;
}

/*
var lengthOfOldBackups = 0;

(function setOldBackupList(){
  console.log("run");
  let item_1 = document.getElementById("itemBackup1");
  let item_2 = document.getElementById("itemBackup2");
  let item_3 = document.getElementById("itemBackup3");
  let item_4 = document.getElementById("itemBackup4");
  
  let itemArr = [item_1, item_2,item_3,item_4];

  let localStorageData = window.localStorage.getItem("previousBackups");
  if(localStorageData == null){
    for(let  i =0; i < 4; i++){
        itemArr[i].textContent = "No Backup History";
    }  
    return;
  }
  lengthOfOldBackups = localStorageData.length;

  for(let  i =0; i < 4; i++){
    let data = localStorageData[i];
    if(data != undefined){ 
      itemArr[i].textContent = data;
    }else{
      itemArr[i].textContent = "N/A";  
    }
  }

  console.log(localStorageData);
});

function editLocalStorage(currStatus){
  let localStorageData = window.localStorage.getItem("previousBackups");  
  
  if(localStorageData == null){
     let obj = {0 : currStatus};
     localStorageData = obj;
  }else if(localStorageData.length < 4){
    
  }
  // else{
  //   let localStorageData = arrayRotate(localStorageData, true);
  //   localStorageData[0] = currStatus;
  // }
  console.log(localStorageData);
  window.localStorage.setItem("previousBackups",JSON.stringify(localStorageData));
}

function arrayRotate(arr, reverse) {
  if (reverse) arr.unshift(arr.pop());
  else arr.push(arr.shift());
  return arr;
}
*/

var activeItemSelector = "#item_1";

let item_1 = document.querySelector("#item_1");
let item_2 = document.querySelector("#item_2");

item_1.addEventListener("click", function (e) {
  if (activeItemSelector == "#item_1") {
  
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

var flagBoolean = true;

let backupBtn = document.querySelector("#takeBackup");

let displayDiv = document.querySelector(".display");

const inputs = document.querySelectorAll(".form-control input");
const labels = document.querySelectorAll(".form-control label");

const emailId = document.querySelector("#email");
const password = document.querySelector("#password");

labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split("")
    .map(
      (letter, idx) => `<span style="
				transition-delay: ${idx * 50}ms
			">${letter}</span>`
    )
    .join("");
});

async function getBackup() {
  // ! change email in call
  let email = emailId.value;
  let pass = password.value;

  // testemail5047  Test@1234
  let value = await axios.post(
    "http://localhost:3000/api/getResult",
    {
      emailId: email,
      passWord: pass,
    }
  );
  console.log("success result");
  return value;
}

async function closeServer() {
  await axios.post("http://localhost:3000/api/close", {});
}

/* -1 > here means invalid email or password format,
        -2 > means email not found in google's database || incorrect password.
        -3 > no project exists in firebase
        2 > success backup 
    */

async function getData() {
  try {
    let item = await axios.post(
      "http://localhost:3000/api/getUpdate",
      {}
    );
    return item;
  } catch (e) {
    console.log("error " + e);
  }
}

async function getZipPath() {
  try {
    await axios.get(
      "http://localhost:3000/api/getZipPath",
      {}
    );
    let downloadBtn = document.querySelector("#completeDiv");
    downloadBtn.href = "http://localhost:3000/api/getZipPath";

    downloadBtn.addEventListener("click", function (e) {
      setTimeout(async () => {
        await axios.get(
          "http://localhost:3000/api/deleteZip"
        );
      }, 5000);
    });
  } catch (e) {
    console.log("error in getting zip path " + e);
  }
}

backupBtn.addEventListener("click", async function (e) {
  addResultDiv();

  let ret = getBackup();
  ret.then(function (e) {
    let result = e;
    console.log(result + "received from api");
    addDivOnResult(result.status);
  });

  ret.catch(function (e) {
    console.log("err found after return " + e);
    addCompleteDiv();
    return;
  });

  if (flagBoolean) {
    setTimeout(async () => {
      let total = 10;
      let curr = 0;

      addProgressDiv();

      let interval = setInterval(async () => {
        if (curr >= total - 1) {
          console.log("last case");
          clearInterval(interval);
          interval = 0;
        }
        let result = await getData();

        result = result.data.split("@");
        curr = result[0];
        total = result[1];

        updateProgressBar(parseInt(curr) + 1, parseInt(total));
      }, 500);
    }, 25000);
  }
});

function updateProgressBar(current, total) {
  console.log("updating progress bar for " + current + "@" + total);
  let progress = document.querySelector("#prog");
  let text = document.querySelector("#text");

  let per = Math.floor((current / total) * 100);
  progress.style.width = per + "%";
  text.textContent = per + "%";
}

function addDivOnResult(result) {
  if (result == 200) {
    console.log("entered email err");
    editLocalStorage("Invalid Credentials");
    addEmailErrorDiv();
    flagBoolean = false;
  } else if (result == 201) {
    editLocalStorage("Invalid Credentials");
    addEmailErrorDiv();
    flagBoolean = false;
  } else if (result == 202) {
    editLocalStorage("No Projects Found");
    addNoProjectError();
    flagBoolean = false;
  } else if (result == 100) {
    editLocalStorage("Backup Successful");
    addCompleteDiv();
  }
}

function addCompleteDiv() {
  var value = [];

  setTimeout(async () => {
    value = await axios.post(
      "http://localhost:3000/api/getData",
      {}
    );
    value = value.data;

    generateKnowMoreDiv(value["success"], value["failure"]);
  }, 18000);
}

async function generateKnowMoreDiv(successList, failureList) {
  let setSuccess = new Set();
  let setFailure = new Set();

  for (let i = 0; i < successList.length; i++) {
    setSuccess.add(successList[i]);
  }

  successList = Array.from(setSuccess);

  console.log("success");
  console.log(successList);

  for (let i = 0; i < failureList.length; i++) {
    setFailure.add(failureList[i]);
  }

  failureList = Array.from(setFailure);

  console.log("failure");
  console.log(failureList);

  let progress = document.querySelector("#prog");
  let text = document.querySelector("#text");

  let per = 100;
  progress.style.width = per + "%";
  text.textContent = per + "%";

  document.querySelector("#progressDiv").remove();
  let coverDiv = document.querySelector(".cover");

  let itemAdd = document.createElement("div");
  itemAdd.classList.add("res-display");

  itemAdd.innerHTML = `<div class="titleLogin">
  <span class="text-title">Result</span>
</div>

<div class="card_lay">
  <img class="img_list" src="./assets/icon_success.png" />
  <div class="item_card">
    Backup Successful
  </div>
</div>

<div class="card_lay">
  <img class="img_list" src="./assets/icon_list.png" />
  <div class="item_card">
    For List of Projects Click Know More
  </div>
</div>
<div class="check-result">
      <div id="takeBackup" class="btn_div_result">
        <a class="btn" href="#" id="completeDiv">
          <span>Download Backup</span>
        </a>
        <a class="btn" href="#" id="moreDetails">
            <span>More Details</span>
          </a>
      </div>
    </div>
</div>`;
  coverDiv.append(itemAdd);

  await getZipPath();

  let newSection = document.createElement("div");
  newSection.classList.add("moreDetails");
  newSection.id = "section_4";
  
  displayDiv.append(newSection);

  let knowMoreBtn = document.querySelector("#moreDetails");
  knowMoreBtn.href = "#section_4";

  for (let i = 0; i < successList.length; i++) {
    newSection.append(generateSuccessCard(successList[i]));
  }

  for (let i = 0; i < failureList.length; i++) {
    newSection.append(generateFailureCard(failureList[i]));
  }

  let moreBtn = document.querySelector("#completeDiv");
  moreBtn.addEventListener("click", function (e) {
    console.log("clicked");
  });
}

function generateSuccessCard(projectId) {
  let card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `<div class="card-header">${projectId}</div>
  <div class="card-main">
    <div class="main-description">Backup Done</div>
  </div>`;
  return card;
}

function generateFailureCard(projectId) {
  let card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `<div class="card-header">${projectId}</div>
  <div class="card-main">
    <div class="main-description">Database Not Found</div>
  </div>`;
  return card;
}

function addResultDiv() {
  let itemAdd = document.createElement("div");
  itemAdd.classList.add("landingContainer");

  itemAdd.innerHTML = `<div class="glassContainer" id="section2"
  >
  <div class="cover">
  <div class="res-display" id="defResDiv">
          <div class="titleLogin">
            <span class="text-title">Result</span>
          </div>

          <div class="card_lay">
            <img class="img_list" src="./assets/time-left.png" />
            <div class="item_card">
              Verifying your credentials
            </div>
          </div>

      </div>
  </div></div>`;
  displayDiv.append(itemAdd);
  item_2.href = "#section2";
}

//<!-- The layout for Error in Email Id or Password format-->

function addEmailErrorDiv() {
  let item = document.querySelector("#defResDiv");
  if (item == null || item === null) {
    return;
  }
  item.remove();
  let coverDiv = document.querySelector(".cover");

  let itemAdd = document.createElement("div");
  itemAdd.classList.add("res-display");

  itemAdd.innerHTML = `<div class="titleLogin">
  <span class="text-title">Result</span>
</div>

<div class="card_lay">
  <img class="img_list" src="./assets/incorrect_error.png" />
  <div class="item_card">
    Account Credentials Invalid
  </div>
</div>

<div class="card_lay">
  <img class="img_list" src="./assets/mail_error.png" />
  <div class="item_card">Recheck Your Credentials and Retry</div>
</div>

<div class="check-result">
  <div id="takeBackup" class="btn_div">
    <a class="btn" href="#section_1" id="retryBtn">
      <span>Retry</span>
    </a>
  </div>
</div>
</div>`;

  coverDiv.append(itemAdd);
}

// <!-- The layout for Error : No projects in firebase -->
function addNoProjectError() {
  document.querySelector("#defResDiv").remove();

  let coverDiv = document.querySelector(".cover");

  let itemAdd = document.createElement("div");
  itemAdd.classList.add("res-display");

  itemAdd.innerHTML = `<div class="titleLogin">
  <span class="text-title">Result</span>
</div>

<div class="card_lay">
  <img class="img_list" src="./assets/incorrect_error.png" />
  <div class="item_card">
    No Projects Found
  </div>
</div>

<div class="card_lay">
  <img class="img_list" src="./assets/question.png" />
  <div class="item_card">Retry After Adding Some Projects</div>
</div>

<div class="check-result">
  <div id="takeBackup" class="btn_div">
    <a class="btn" href="#">
      <span>Retry</span>
    </a>
  </div>
</div>
  `;

  coverDiv.append(itemAdd);
}

function addProgressDiv() {
  document.querySelector("#defResDiv").remove();

  let coverDiv = document.querySelector(".cover");

  let itemAdd = document.createElement("div");
  itemAdd.id = "progressDiv";
  itemAdd.classList.add("res-display");

  itemAdd.innerHTML = `<div class="titleLogin">
  <span class="text-title">Result</span>
</div>
<div class="card_lay">
          <img class="img_list" src="./assets/firebase_db.png" />
          <div class="item_card">Backup Initiated </div>
        </div>

        <div class="progress">
          <div id="prog" class="bar">
            <p  id = "text" class="percent">0%</p>
          </div>
        </div>

        <div class="check-result">

          <div id="moreDetails" class="btn_div">
            <a class="btn" href="#">
              <span>Please Wait</span>
            </a>
          </div>
        </div>
      </div>`;

  coverDiv.append(itemAdd);
}
