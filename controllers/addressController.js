const Address = require("../models").Address;
const User = require("../models").User;
const PurchaseLog = require("../models").PurchaseLog;



const getAddress = async (req, res) => {

};


const postAddress = async (req, res) => {
  const {
    body:{postCode,roadAddress,detailAddress,extraAddress}
  } = req;
console.log(req);
  await Address.create({
    address: roadAddress,
    detailesAddress: detailAddress,
    postalCode:postCode,
    phoneNumber:extraAddress
  },{
    include:[{
      model: User, as:"registered_address",foreignKey: "userId",
    },{
      model: PurchaseLog, as: "destination",foreignKey: "addressId",
    }]
  });
};

const updateAddress = async (req, res) => {

};

const deleteAddress = async (req, res) => {

};


module.exports ={postAddress};