const Eventad = require("../models").Eventad;
const crypto = require('crypto');
const fs = require('fs')


 const getEventad = async (req, res) => {
  const eventad = await Eventad.findAll({});
  
  res.render("admin_eventad", { title: "", data:{
    eventadList:eventad
  } });
 }
const postEventad = async (req, res) => {
  const {
    body: { title, imageurl, content, startDate, endDate },
  } = req;
  // console.log(req.body)
 
  const hashedTitle = crypto.createHmac('sha256',process.env.HASH_SECRET).update(title).digest('hex');
  
  var date = new Date()
  var dStr = '' + date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() ;
  // console.log(req.body.subImageFiles.slice(0,30))
  // console.log(JSON.parse(req.body.subImageFiles)[0])

  const fileText = req.body.imageText
  const fileName = dStr + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + req.body.imageName.split('.')[req.body.imageName.split('.').length - 1]
  var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");

  fs.writeFile('data/image/' + 'eventad_' + fileName, base64Data, 'base64', function(err) {
    console.log(err);
  });
  await Eventad.create({
    title: title,
    url: hashedTitle,
    imageurl: 'eventad_' + fileName,
    content: content,
    start: startDate,
    end:endDate,
    flag: 1,
    visible: 1,
  }).catch(function(error){
    console.log(error);
  });
  let eventad = await Eventad.findAll({});
  res.render("admin_eventad", { title: "",  data:{
    eventadList:eventad
  } });
};

const getUpdateEventad = async (req, res) => {
  const {
    params: { eventadId },
  } = req;
  const updateEventad = await Eventad.findOne({ where: { url : eventadId} });
  req.session.updateEventadId = updateEventad.id;
  
  res.render("admin_eventad_detail", { title: "", data:{
    updateEventad: updateEventad,
   
  } });
};
const postUpdateEventad = async (req,res) => {
  const {
      body: {title, imageurl, content, datetimes}
  } =req;
  console.log(req.params.eventadId)
  const datetimesArray = datetimes.split("-");
  

  const eventad = await Eventad.findOne({
    where: {
      id: req.params.eventadId
    }
  })
  eventad.title =  title;
  eventad.content =  content;
  eventad.start = datetimesArray[0];
  eventad.end = datetimesArray[1];
  eventad.flag =  1;
  eventad.visible =  1;
  if(req.body.imageText != undefined){
    var date = new Date()
    var dStr = '' + date.getFullYear() + (date.getMonth() + 1)  + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() ;
  

    const fileText = req.body.imageText
    const fileName = dStr + '_' +  (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + req.body.imageName.split('.')[req.body.imageName.split('.').length - 1]
    var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
  
    fs.writeFile('data/image/' + 'eventad_' + fileName, base64Data, 'base64', function(err) {
      console.log(err);
    });
    eventad.imageurl = 'eventad_' + fileName;
    await eventad.save()
  }
  if(eventad != undefined){
    res.sendStatus(200);
  }else{
    res.sendStatus(400);
  }
};

const deleteEventad = async (req,res)=> {
  await Eventad.destroy({where:{id:req.session.updateEventadId}});
  let eventad = await Eventad.findAll({});
    res.render("admin_eventad", { title: "",  data:{
      eventadList:eventad
    } });
};

module.exports = {getEventad,postEventad, getUpdateEventad,postUpdateEventad,deleteEventad};
