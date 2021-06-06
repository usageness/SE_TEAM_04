const db = require("../models");
const Eventad = require("../models").Eventad;
const crypto = require('crypto');
const fs = require('fs')


const getEventad = async (req, res) => {
    var eventadList = await Eventad.findAll({});

    res.render("admin_eventad", {
        title: "", data: {
            eventadList
        }
    });
}
const postEventad = async (req, res) => {
    const {
        body: {title, imageurl, content, startDate, endDate},
    } = req;
    // console.log(req.body)

    const hashedTitle = crypto.createHmac('sha256', process.env.HASH_SECRET).update(title).digest('hex');

    var date = new Date()
    var dStr = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
    // console.log(req.body.subImageFiles.slice(0,30))
    // console.log(JSON.parse(req.body.subImageFiles)[0])

    const fileText = req.body.imageText
    const fileName = dStr + '_' + (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + req.body.imageName.split('.')[req.body.imageName.split('.').length - 1]
    var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFile('data/image/' + 'eventad_' + fileName, base64Data, 'base64', function (err) {
        console.log(err);
    });
    await Eventad.create({
        title: title,
        url: hashedTitle,
        imageurl: 'eventad_' + fileName,
        content: content,
        start: startDate,
        end: endDate,
        flag: 1,
        visible: 1,
    }).catch(function (error) {
        console.log(error);
    });
    let eventad = await Eventad.findAll({});
    res.render("admin_eventad", {
        title: "", data: {
            eventadList: eventad
        }
    });
};

const getUpdateEventad = async (req, res) => {
    const {
        params: {eventadId},
    } = req;
    const updateEventad = await Eventad.findOne({where: {url: eventadId}});
    req.session.updateEventadId = updateEventad.id;

    res.render("admin_eventad_detail", {
        title: "", data: {
            updateEventad: updateEventad,

        }
    });
};
const postUpdateEventad = async (req, res) => {
    const {
        body: {title, imageurl, content, startDate, endDate, status}
    } = req;
    console.log(status);

    const eventad = await Eventad.findOne({
        where: {
            id: req.params.eventadId
        }
    })
    eventad.title = title;
    eventad.content = content;
    eventad.start = startDate;
    eventad.end = endDate;
    eventad.flag = 1;
    eventad.visible = status;
    if (req.body.imageText != undefined) {
        var date = new Date()
        var dStr = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();


        const fileText = req.body.imageText
        const fileName = dStr + '_' + (Math.floor(Math.random() * (99 - 10)) + 10) + '.' + req.body.imageName.split('.')[req.body.imageName.split('.').length - 1]
        var base64Data = fileText.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");

        fs.writeFile('data/image/' + 'eventad_' + fileName, base64Data, 'base64', function (err) {
            console.log(err);
        });
        eventad.imageurl = 'eventad_' + fileName;


    }
    await eventad.save();
    if (eventad != undefined) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
};

const deleteEventad = async (req, res) => {
    await Eventad.destroy({where: {id: req.params.eventadId}});
    let eventad = await Eventad.findAll({});
    res.render("admin_eventad", {
        title: "", data: {
            eventadList: eventad
        }
    });
};

const eventadVisibelCheck = async (req, res, next) => {
    function getTimeStamp() {

        var d = new Date();
        var s =
            leadingZeros(d.getFullYear(), 4) + '-' +
            leadingZeros(d.getMonth() + 1, 2) + '-' +
            leadingZeros(d.getDate(), 2);

        return s;
    }

    function leadingZeros(n, digits) {

        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    }

    var today = getTimeStamp();
    today.toString(today);

    let eventadList = await Eventad.findAll({});


    for (let i = 0; i < eventadList.length; i++) {
        if (eventadList[i].visible != 2) {
            if (eventadList[i].start <= today && eventadList[i].end >= today || eventadList[i].start == today || eventadList[i].end == today) {
                await Eventad.update({visible: 1}, {where: {id: eventadList[i].id}});
            } else {
                await Eventad.update({visible: 0}, {where: {id: eventadList[i].id}});
            }
        }
    }

    next();
};

const getEventadDetail = async (req, res) => {
    const {
        params: eventadId
    } = req;
    let session = req.session;
    let category = await db.Category.findAll({
        attributes: ["id", "name"],
    });
    let eventad = await Eventad.findOne({where: {id: req.params.eventadId}});

    res.render("event_detail", {
        title: "", session,
        category: category,
        data: {
            eventad
        }
    });

};

module.exports = {
    getEventad,
    postEventad,
    getUpdateEventad,
    postUpdateEventad,
    deleteEventad,
    eventadVisibelCheck,
    getEventadDetail
};
