var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')('127.0.0.1:27017/ProjectDB')

// upload
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    // You can define how the file should be named here
    // For example, to keep the original file name, use:
    cb(null, Date.now()+".jpg");
  }
});

var upload = multer({ storage: storage });

router.get('/projects',async function(req, res, next) {
  var projects = await db.get('Projects');
  var project = await projects.find({},{});
  res.render('adminprojects', {projects:project});
});

router.get('/projects/add',async function(req, res, next) {
  res.render('addproject');
});

router.get('/projects/edit/:id', async function(req, res, next) {
  var projects = await db.get('Projects');
  var project = await projects.find(req.params.id, {});
  res.render('editproject', {projects:project});
});

router.post('/projects/delete/', async function(req, res, next) {
  try {
    var projects = await db.get('Projects');
    await projects.remove({  
      _id: req.body.id
    });  
    res.redirect("/admin/projects");
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/projects/edit', upload.single("image"), async function(req, res, next) {
  var projects = await db.get('Projects');

  // edit and image
  if(req.file){

    var projectimage = req.file.filename;

    try{
      await projects.update({
        _id: req.body.id
      }, {
        $set:{
          name: req.body.name,
          description: req.body.description,
          date: req.body.date,
          image: projectimage
        }
      });

      res.location('/admin/projects');
      res.redirect('/admin/projects');

    }catch(error){
      res.send(error)
    }

  }else{

    try{
      await projects.update({
        _id: req.body.id
      }, {
        $set:{
          name: req.body.name,
          description: req.body.description,
          date: req.body.date
        }
      });

      res.location('/admin/projects');
      res.redirect('/admin/projects');

    }catch(error){
      res.send(error)
    }
  }

});

router.post('/projects/add', upload.single("image"), async function(req, res, next) {
  var projects = await db.get('Projects');
  if(req.file){
    var projectimage = req.file.filename;
  }else{
    var projectimage = "No Image";  
  }

  try{
    await projects.insert({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      image: projectimage
    });

    res.location('/admin/projects');
    res.redirect('/admin/projects');
  }catch(error){
    res.send(error)
  }

});

module.exports = router; 
