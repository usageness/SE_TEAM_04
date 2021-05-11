const Address = require("../models").Address;
const User = require("../models").User;
const PurchaseLog = require("../models").PurchaseLog;

const getAddress = async (req, res) => {
  let address = await Address.findAll({});
  res.render("address_manage", { title: "Express", data:{
    addressList:address
  } });
};

const postAddress = async (req, res) => {
  const {
    body: { postcode, roadAddress, detailAddress, extraAddress, addressname },
  } = req;
  console.log(req.body);
  await Address.create(
    {
      name: addressname,
      address: roadAddress,
      detailesAddress: detailAddress,
      postalCode: postcode,
      phoneNumber: extraAddress,
      isChecked: 0,
    },
    {
      include: [
        {
          model: User,
          as: "registered_address",
          foreignKey: "userId",
        },
        {
          model: PurchaseLog,
          as: "destination",
          foreignKey: "addressId",
        },
      ],
    }
  );
  let address = await Address.findAll({});
  res.render("address_manage", { title: "Express", data:{
    addressList:address
  } });
};

const getUpdateAddress = async (req, res) => {
  const {
    params: {addressId},
  } = req;
  
  const updateAddress = await Address.findOne({where:{id:addressId}});
  res.render("address_update",{title:"", data:{
    updateAddress:updateAddress,
    addressId:addressId
  }})
};

const postUpdateAddress = async (req, res) => {
  const {
   params:{addressId},
    body:{postcode, roadAddress, detailAddress, extraAddress, addressname }
  } = req;
  console.log(req.params);
console.log(addressId);
  await Address.update({
    name: addressname,
    address: roadAddress,
    detailesAddress: detailAddress,
    postalCode: postcode,
    phoneNumber: extraAddress,
    isChecked: 0,
  },{where:{id: addressId}});
  
  let address = await Address.findAll({});
  res.render("address_manage", { title: "Express", data:{
    addressList:address
  } });
};

const deleteAddress = async (req, res) => {};

module.exports = { getAddress, postAddress, getUpdateAddress,postUpdateAddress,deleteAddress };
