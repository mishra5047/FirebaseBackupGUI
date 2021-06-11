const express = require('express');

const os = require("os");
const fs = require("fs");

const homeDir = os.homedir();
let path = (homeDir + "/FirebaseZip.zip");

const backupCli = require("./backup_cli");

const app = express()

const port = process.env.PORT || 3000;
const cors = require("cors");
const bp = require("body-parser");

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Get')
})

app.post('/api/getResult',  async function (req, res) {
  let data = await backupCli.doBackup(req.body["emailId"], req.body["passWord"]);
  res.send(data);
}) 
  
app.post('/api/getUpdate',async function (req, res){
  let data = await backupCli.getUpdate(); 
    res.send(data);
})

app.post('/api/getData', async function (req, res){
  let result = await backupCli.getResultData();
  res.send(result);
})


app.get('/api/getZipPath', async function (req, res){
  console.log(path);
  res.download(path);

  // set timout lagado 2 min ka then delete
})

app.get('/api/deleteZip', async function (req, res){
  fs.rmSync(path);
  fs.rmdirSync(homeDir + "/FirebaseBackup", {recursive:true});
})

app.listen(port, () => {
  console.log(`Express App listening at http://localhost:${port}`)
})