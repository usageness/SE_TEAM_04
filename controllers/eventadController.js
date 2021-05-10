const Eventad = require("../models").Eventad;
const crypto = require('crypto');

 const getEventad = async (req, res) => {
  const eventad = await Eventad.findAll({});
  
  res.render("admin_eventad", { title: "", data:{
    eventadList:eventad
  } });
 }
const postEventad = async (req, res) => {
  const {
    body: { title, imageurl, content, datetimes },
  } = req;
  
const datetimesArray = datetimes.split("-");
const hashedTitle = crypto.createHmac('sha256','secret').update(title).digest('hex');
console.log(datetimesArray);
  await Eventad.create({
   
    title: title,
    url: hashedTitle,
    imageurl: imageurl,
    content: content,
    start:datetimesArray[0],
    end:datetimesArray[1],
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
    
  const datetimesArray = datetimes.split("-");
  const hashedTitle = crypto.createHmac('sha256','secret').update(title).digest('hex');
 console.log(req.session.updateEventadId);
  await Eventad.update({
    title: title,
    url: hashedTitle,
    imageurl: imageurl,
    content: content,
    start:datetimesArray[0],
    end:datetimesArray[1],
    flag: 1,
    visible: 1,
    },{where:{id:req.session.updateEventadId}});
    let eventad = await Eventad.findAll({});
    res.render("admin_eventad", { title: "",  data:{
      eventadList:eventad
    } });
};

module.exports = {getEventad,postEventad, getUpdateEventad,postUpdateEventad};