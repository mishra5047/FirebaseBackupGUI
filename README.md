<p align="center">
  <a href="" rel="noopener">
 <img src="https://miro.medium.com/max/770/1*HFlYgB6gVLc4Su9HsB9MZg.png" alt="Project logo"></a>
</p>
<h3 align="center">Firebase Realtime Database Backup Taker</h3>

<div align="center">

![GitHub Repo stars](https://img.shields.io/github/stars/mishra5047/FirebaseBackup?style=social)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/mishra5047/FirebaseBackup)
![GitHub forks](https://img.shields.io/github/forks/mishra5047/FirebaseBackup?style=social)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<p align="center"> .
    <br> 
</p>

## 📝 Table of Contents

- [Problem Statement](#problem_statement)
- [Dependencies / Limitations](#limitations)
- [Project Structure](#structure)
- [Future Scope](#future_scope)
- [Setting up a local environment](#getting_started)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Authors](#authors)
- [ScreenShots](#screenshots)

## 🧐 Problem Statement <a name = "problem_statement"></a>

For a firebase user that uses the free plan for any project. The user has no option to automatically take backup of the realtime database at a specific interval.

- IDEAL: I came up with the solution to run this script in order to take the backup of all the projects existing in the user's firebase console.
- *Note*: This is not a way to avoid the paid plan of firebase, it's just an alternative to help students to backup their project's important data.

## ⛓️ Dependencies / Limitations <a name = "limitations"></a>

- The user must have an valid google account in order to login to firebase.
- There should be at least one project existing in his / her Firebase Console.
- In case the user has a project that doesn't have a realtime database in this case the script will just notify the user after the completion.

## Package Dependencies -
- Cli-progress [https://www.npmjs.com/package/cli-progress]
- Node-Emoji [https://www.npmjs.com/package/node-emoji]
- OS [https://www.npmjs.com/package/os]
- FS [https://www.npmjs.com/package/fs]
- Puppeteer [https://www.npmjs.com/package/puppeteer]
- Cli Table [https://www.npmjs.com/package/cli-table]
- Colors [https://www.npmjs.com/package/colors]
- Express[https://expressjs.com/]

## 📁 Project Structure <a name="structure"></a>

- 💻 main.js -> Main script for electron application.
- 💻 app.js -> The server file.
- 💻 startApi.js -> Script for starting the Server.
- 💻 script.html -> Script for the Home Page.
- 💻 index.html -> The Home Page
- 💻 loginPage.html -> The Login Page
- 💻 script.js -> Script for the Home Page.
- 💻 script_login.js -> Script for the Login Page.
- 📁 Util -> Contains the utility scrips like validation and display functions.

## 🚀 Future Scope <a name = "future_scope"></a>

Right now this script is only capable of taking backup of firebase realtime database. It can be expanded to other services as well.

The local folder of backup can be uploaded to google drive of the user using Google Drive API. 

If you thing any other improvements can be done, raise an issue under the issues tab and i'll work on it.

## 🏁 Getting Started <a name = "getting_started"></a>

### Prerequisites

No Prerequisites

### Installing

No need to install anything, just download the setup for your machine and explore the same.

## 🎈 Usage <a name="usage"></a>

Just run the app in any machine, and meanwhile the script runs - grab a cup of coffee.

```
Download Your Zip and you are good to go
```
## ⛏️ Built With <a name = "tech_stack"></a>

- [Firebase](https://console.firebase.google.com/) - Database
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Express](https://expressjs.com/) - API

## ✍️ Authors <a name = "authors"></a>

- [@AbhishekMishra](https://github.com/mishra5047)

## 🏁 Screenshots <a name="screenshots"></a> 
