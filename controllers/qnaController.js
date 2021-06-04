const getQna = (req,res) => {
 let session =req.session;

 res.render("qnaResister",{
   session
 });
}

const postQna = (req,res) => {
  let session =req.session;
  res.render("qnaList",{
    session
  });
}

module.exports = {getQna,postQna };
