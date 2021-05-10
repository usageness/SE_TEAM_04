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
  
  /*
  const start = req.body.date
  .daterangepicker({
   ampm: false,
   locale: {
   format: "YYYY M/DD hh:mm",
},
})
.data("daterangepicker").startDate._i;

const end = req.body.date
.daterangepicker({
  ampm: false,
  locale: {
    format: "YYYY M/DD hh:mm",
  },
})
.data("daterangepicker").endDate._i;
*/

const datetimesArray = datetimes.split("-");
const hashedTitle = crypto.createHmac('sha256','secret').update(title).digest('hex');
console.log(datetimesArray);
  await Eventad.create({
   
    title: title,
    url: '/eventad/'+hashedTitle,
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
    params: { id },
  } = req;
  const updateEventad = await Eventad.findOne({ where: { id } });
  res.render("admin_eventad", { title: "", fixEventad });
};
 const postUpdateEventad = async (req,res) => {
    const {
        params: {id},
        body: {title, imageurl, content}
    } =req;
    const start = req.body.date
    .daterangepicker({
      ampm: false,
      locale: {
        format: "YYYY M/DD hh:mm",
      },
    })
    .data("daterangepicker").startDate._i;
  const end = req.body.date
    .daterangepicker({
      ampm: false,
      locale: {
        format: "YYYY M/DD hh:mm",
      },
    })
    .data("daterangepicker").endDate._i;
    await Eventad.update({
    imageurl,
    title,
    content,
    start,
    end,
    url: 111,
    flag: 1,
    visible: 1,
    },{where:{_id:id}});
   
};

module.exports = {getEventad,postEventad, getUpdateEventad,postUpdateEventad};