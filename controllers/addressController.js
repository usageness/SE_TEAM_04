const Address = require("../models").Address;
const User = require("../models").User;
const PurchaseLog = require("../models").PurchaseLog;

const getAddress = async (req, res) => {
  let session = req.session;
  let address = await Address.findAll({});
  let defaultAddress = await Address.findOne({where:{isChecked:1}});
  res.render("address_manage", { title: "Express", session, data:{
    addressList:address,
    defaultAddress
  }});
};

const postAddress = async (req, res) => {
  const {
    body:{address}
  } =req;
  console.log(address, req.body);
  await Address.update({isChecked:0},{where:{}});
  await Address.update({isChecked:1},{where:{name:address}});
  res.redirect("/address");
};

const getAddressRegister = async (req, res) => {
  res.render("address_register", { title: "Express", });
};

const postAddressRegister = async (req, res) => {
  const {
    body: { postcode, roadAddress, detailAddress, extraAddress, addressname,receiver },
  } = req;
 console.log(req.body);

if(await Address.findOne({where:{name:addressname}})){
  res.send('<script type="text/javascript">alert("중복된 배송지 이름입니다.");</script>');
}
  await Address.create(
    {
      name: addressname,
      address: roadAddress,
      detailesAddress: detailAddress,
      postalCode: postcode,
      phoneNumber: extraAddress,
      receiver: receiver,
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
  res.redirect("/address");
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
    body:{postcode, roadAddress, detailAddress, extraAddress, addressname,receiver }
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
    receiver:receiver
  },{where:{id: addressId}});
  
  res.redirect("/address");
};

const deleteAddress = async (req, res) => {
  
  await Address.destroy({where:{ id: req.params.addressId}});
  res.redirect("/address");
};

const postRegisterAddress = async (req,res)=>{
  console.log(req.body);
}
module.exports = { getAddress, postAddress,getAddressRegister,postAddressRegister, getUpdateAddress,postUpdateAddress,deleteAddress };
