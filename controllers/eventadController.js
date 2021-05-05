import Eventad from "../models/eventad";

export const getEventad = async (req, res) => {
  let eventadList = await Eventad.findAll({});
  res.render("admin_eventad", { title: "", eventadList });
};

export const postEventad = async (req, res) => {
  const {
    body: { title, imageurl, content },
  } = req;
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
  await Eventad.create({
    imageurl,
    title,
    content,
    start,
    end,
    url: 111,
    flag: 1,
    visible: 1,
  });
  getEventad();
};

export const getUpdateEventad = async (req, res) => {
  const {
    params: { id },
  } = req;
  const updateEventad = await Eventad.findOne({ where: { id } });
  res.render("admin_eventad", { title: "", fixEventad });
};

export const postUpdateEventad = async (req,res) => {
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
    getEventad();
};
 
