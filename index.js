const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const upload = require('express-fileupload')
const db = require('./query')
const port = 3006


if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(upload())

app.get('/userYayasan', db.getYayasan)
app.get('/userDisdik', db.getDisdik)
app.post('/postProdi', db.postProdi)
app.get('/getProfil', db.getProfil)
app.get('/getProdi', db.getProdi)
app.get('/getProdiHafiz', db.getProdiHafiz)
app.get('/getPerijinanP2T',db.getP2T)
app.get('/getCabdin', db.getCabdin)
app.get('/getOnProgres', db.getOnProgress)
app.get('/getDatacabdin', db.getDataCabdin)
app.post('/getLogin', db.getLogin)
app.post('/getLoginSMK', db.getLoginSMK)
app.post('/getLoginCabdin', db.getLoginCabdin)
app.post('/getLoginDisdik', db.getLoginDisdik)
app.post('/getLoginYayasan', db.getLoginYayasan)
app.post('/getLoginp2T', db.getLoginP2T)
app.get('/getusersmk', db.getSMK)
app.get('/getuserp2t', db.getUserP2T)
app.get('/getdatadisdik', db.getDataDisdik)
app.post('/postperijinan', db.postPerijinanSMK)
app.post('/postsekolah', db.postSekolahYayasan)



  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })