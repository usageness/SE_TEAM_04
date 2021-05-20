const Address = require("../models").Address;
const User = require("../models").User;
const PurchaseLog = require("../models").PurchaseLog;



const getAddress = async (req, res) => {

};


const postAddress = async (req, res) => {
  const {
    body:{postcode,roadAddress,detailAddress,extraAddress,addressname}
  } = req;
console.log(req.body);
  await Address.create({
    name: addressname,
    address: roadAddress,
    detailesAddress: detailAddress,
    postalCode:postcode,
    phoneNumber:extraAddress
   
  },{
    include:[{
      model: User, as:"registered_address",foreignKey: "userId",
    },{
      model: PurchaseLog, as: "destination",foreignKey: "addressId",
    }]
  });
  res.render('address_manage', { title: 'Express' });
};

const updateAddress = async (req, res) => {

};

const deleteAddress = async (req, res) => {

};


module.exports ={postAddress};