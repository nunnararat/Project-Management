var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')('127.0.0.1:27017/ProjectDB')

/* GET home page. */
router.get('/', async function(req, res, next) {
  var projects = await db.get('Projects');   
  var project = await projects.find({},{});
  res.render('index', {projects:project});
});


router.get('/details/:id', async function(req, res, next) {
  var projects = await db.get('Projects');
  var project = await projects.find(req.params.id,{});
  res.render('details', {projects:project});
});
 
module.exports = router;
