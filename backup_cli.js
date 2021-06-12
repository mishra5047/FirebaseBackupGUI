module.exports = {
  doBackup,
  getUpdate,
  checkIfDone,
  getResultData,
};

var currentState = 0;
var totalProject = 406;

const emoji = require("node-emoji");
const os = require("os");
const fs = require("fs");
const puppeteer = require("puppeteer");
const zipDir = require("zip-dir");

// ! Create a file by the name of Credentials.json inside Utils, with id and password
const credential = require("./Util/Credentials.json");

const validation = require("./Util/dataValidation");
const utilJs = require("./Util/util");

const cliProgress = require("cli-progress");
const _colors = require("colors");
var bar = getProgressBar();

/* Selectors */
var createDB =
  ".fire-zero-state-header-button-cta.mat-focus-indicator.mat-raised-button.mat-button-base.mat-primary";
//append the console url
var startUrl = "https://console.firebase.google.com/project/";
var endUrl = "/database";

/*Selectors for menu button, export and expand DB options
 */
var optionSelector = "button[aria-label='Open menu']";
var exportDB = "button[ng-click='controller.showExportDialog()']";
var expandDB = "button[ng-click='controller.expandAll()']";

//Emoji used throughout the project
const emojiExclamation = emoji.get("exclamation");
const emojiCross = emoji.get("x");
/*Code snippet to generate date according to pre decided format
Format => Date_Month_Year-Time(HR:MM -> 24 Hrs Format)
*/
const date = utilJs.getDate();

/*Path variables to fetch and store the downloaded database files*/
const homeDir = os.homedir();
const findPath = homeDir + "/Downloads";
const store = homeDir + "/FirebaseBackup";

// ! Error Codes
/* 400 > here means invalid email or password format,
        401 > means email not found in google's database || incorrect password.
        402 > no project exists in firebase
        101 > success backup 
    */

//array to store the successful backup and failure backup projects list
var successBackup = [];
var failureBackup = [];
var id = "";
var pass = "";

async function doBackup(email, password) {
  //function to show the welcome message
  id = email;
  pass = password;

  //checking if the entered emailId and password
  if (validation.checkEmailAndPassword(id, pass) == -1) {
    currentState = 200;
    return 200;
  }

  utilJs.welcomeFunction();

  //opening the browser
  let browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
    ignoreDefaultArgs : ['--disable-extensions'],
  });

  var page = await login(browser);


  if (page == 201) {
    console.log("invalid id or password");
    return 201;
  }
  //list to store all the project id's
  let projectIds = [];
  projectIds = await getProjectsList(page, projectIds);

  //check if user console has any project or not, exit if not found
  if (projectIds.length == 0) {
    console.log(emojiCross + " No Firebase Projects Found");
    currentState = 202;
    page.close();
    return 202;
  }

  //function to download the backup
  await getDataFromFirebase(
    projectIds,
    browser,
    startUrl,
    endUrl,
    expandDB,
    optionSelector,
    exportDB
  );

  //close the browser
  await browser.close();

  //closing the Progress Bar
  bar.stop();

  //code to group backup data
  await sortBackups(projectIds);

  //show the success message and analytics to the user
  utilJs.successMessage(date, store, successBackup, failureBackup);

  return 100;
}

async function getResultData() {
  let obj = {
    success: successBackup,
    failure: failureBackup,
  };
  return obj;
}

async function getDataFromFirebase(
  projectIds,
  browser,
  startUrl,
  endUrl,
  expandDB,
  optionSelector,
  exportDB
) {
  let set = new Set();

  /* Why do we need to store all the projects in the set?
    There are two types of projects displayed on firebase console home page, Recent projects and all projects.
    The same project is displayed in both of them.
    In order to avoid duplicity we need this set
  */

  //add all projects to the set
  for (let i = 0; i < projectIds.length; i++) {
    set.add(projectIds[i]);
  }

  //store the set value in projectId array
  projectIds = Array.from(set);

  totalProject = projectIds.length;

  //initiate the progress bar
  bar.start(projectIds.length, 0);

  for (let i = 0; i < projectIds.length; i++) {
    currentState = i;
    // * update the progress bar
    bar.update(i + 1);

    // * Open the browser and export the JSON file for the Realtime database
    let pageNew = await browser.newPage();
    let url = startUrl + projectIds[i] + endUrl;

    await pageNew.goto(url);
    await pageNew.waitForTimeout(1000);

    let result = await pageNew.$(createDB);

    // ! if the database exists push it in success list else in failure list

    if (result === null || result == null) {
      successBackup.push(projectIds[i]);
      await pageNew.waitForSelector(expandDB);
      await pageNew.click(expandDB);
      await pageNew.waitForSelector(optionSelector);
      await pageNew.click(optionSelector);
      await pageNew.waitForTimeout(500);
      await pageNew.click(exportDB);
      await pageNew.waitForTimeout(3000);
    } else {
      failureBackup.push(projectIds[i]);
    }
    await pageNew.close();
  }
}

// * Function to get the project id list from the firebase console
async function getProjectsList(page, projectIds) {
  if (page == undefined || page === undefined) {
    console.log("page not found");
    return;
  }
  await page
    .evaluate(function () {
      let selector = ".project-id.ng-star-inserted";
      let projects = document.querySelectorAll(selector);
      let items = [];
      for (let i = 0; i < projects.length; i++) {
        items[i] = document.querySelectorAll(".project-id.ng-star-inserted")[
          i
        ].textContent;
      }
      return items;
    })
    .then(function (data) {
      projectIds = data;
    })
    .catch((e) => {
      console.log("eval err   " + e);
    });

  return projectIds;
}

// * function to login to the firebase console
async function login(browser) {
  let pages = await browser.pages();
  let page = pages[0];

  await page.goto("https://console.firebase.google.com/");
  await page.waitForSelector('input[type="email"]');
  await page.click('input[type="email"]');
  await page.type('input[type="email"]', id);

  await page.waitForSelector("#identifierNext");
  await page.click("#identifierNext");

  await page.waitForTimeout(1000);

  // ! Selector of the element that shows up when we enter incorrect email or password
  let selectorInvalid = "input[aria-invalid='true']";
  let result = await page.$(selectorInvalid);

  if (result == null) {
    // * the user email entered is correct

    // * Code to Enter Password begins*/
    await page.waitForTimeout(5000);
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', pass);

    await page.waitForSelector("#passwordNext");
    await page.click("#passwordNext");
    await page.waitForTimeout(1000);

    // * Selector of the element that shows up when we enter incorrect password*/
    let result = await page.$(selectorInvalid);

    if (result == null || result === null) {
      // ! the password entered was valid
      await page.waitForNavigation();
      return page;
    } else {
      // ! the entered password is wrong
      console.log(
        emojiCross + " The entered password is incorrect " + emojiCross
      );
      await page.close();
      return 201;
    }
  } else {
    //  ! the entered email is wrong
    console.log(emojiCross + " The entered email is incorrect " + emojiCross);
    await page.close();
    return 201;
  }
}

// * function to set the appearance of the progress bar
function getProgressBar() {
  return new cliProgress.SingleBar({
    format:
      _colors.cyan(" {bar}") +
      " {percentage}% | ETA: {eta}s | {value}/{total} Projects",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });
}

// * function to tell the user that no input was provided and the script will use the default input set by the author
function showDefault() {
  console.log(
    emojiExclamation +
      " no arguments provided using the default email and password " +
      emojiExclamation
  );

  // ! Create a file by the name of Credentials.json inside Utils
  id = credential["id"];
  pass = credential["pass"];
}

async function checkIfDone() {
  if (currentState == totalProject || currentState == totalProject - 1) {
    return true;
  }
  return false;
}

// * function to sort projects based on their id's
async function sortBackups(projectIds) {

  utilJs.createDir(store);
  for (let i = 0; i < projectIds.length; i++) {
    let projectName = projectIds[i].split("-")[0];
    await findProject(projectName);
  }

  zipDir(
    store,
    { saveTo: homeDir + "/FirebaseZip.zip" },
    function (err, buffer) {}
  );
}

async function getUpdate() {
  let res = currentState + "@" + totalProject;
  return res;
}

// * function to move the downloaded backup file the designated folder for that project id
async function findProject(projectName) {
  let dir = fs.readdirSync(findPath);
  dir.forEach((item) => {
    if (item.toString().includes(projectName)) {
      utilJs.createDir(store + "/" + projectName);
      utilJs.createDir(store + "/" + projectName + "/" + date);
      //create a new folder under Firebase Backup folder by the name of the project
      fs.copyFile(
        findPath + "/" + item,
        store + "/" + projectName + "/" + date + "/" + (projectName + ".json"),
        (err) => {
          if (err) {
            console.log(err);
          } else {
            utilJs.deleteFile(findPath + "/" + item);
          }
        }
      );
    }
  });
}