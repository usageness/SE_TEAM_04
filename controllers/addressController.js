const Address = require("../models").Address;
const User = require("../models").User;
const PurchaseLog = require("../models").PurchaseLog;

const getAddress = async (req, res) => {
  let session = req.session;
  console.log(req.params.userId);
  const loginUser = await User.findOne({where:{user_id:req.params.userId}});
 
  let address = await Address.findAll({where:{userId:loginUser.id,isChecked:0}});
  let defaultAddress = await Address.findOne({where:{userId:loginUser.id,isChecked:1}});
  res.render("address_manage", { title: "Express", session, data:{
    addressList:address,
    defaultAddress,
    session
  }});
};

const postAddress = async (req, res) => {
  const {
    body:{address}
  } =req;
  let session = req.session;
  await Address.update({isChecked:0},{where:{}});
  await Address.update({isChecked:1},{where:{name:address}});
  const loginUser = await User.findOne({where:{user_id:req.params.userId}});

  let userAddress = await Address.findAll({where:{userId:loginUser.id,isChecked:0}});
  let defaultAddress = await Address.findOne({where:{isChecked:1,userId:loginUser.id}});
  res.render("address_manage", { title: "Express", session, data:{
    addressList:userAddress,
    defaultAddress,
    session
  }});
};

const getAddressRegister = async (req, res) => {
  let session = req.session;
  res.render("address_register", { title: "Express",session });
};

const postAddressRegister = async (req, res) => {
  const {
    body: { postcode, roadAddress, detailAddress, extraAddress, addressname,receiver },
    params:{userId}
  } = req;
 console.log(req.body);
let session =req.session;
if(await Address.findOne({where:{name:addressname}})){
  res.send('<script type="text/javascript">alert("중복된 배송지 이름입니다.");</script>');
  res.redirect("/user/${userId}/address/new");
}
  const address = await Address.create(
    {
      name: addressname,
      address: roadAddress,
      detailesAddress: detailAddress,
      postalCode: postcode,
      phoneNumber: extraAddress,
      receiver: receiver,
      isChecked: 0,
    }
  );
  
  const user = await User.findOne({where:{user_id:req.session.user_id}})
  console.log(user);
  address.userId = user.id;
  await address.save();
  res.redirect("/user/"+userId+"/address");
}

const getUpdateAddress = async (req, res) => {
  let session = req.session;
  const {
    params: {addressId},
  } = req;
  
  const updateAddress = await Address.findOne({where:{id:addressId}});
  res.render("address_update",{title:"", data:{
    updateAddress:updateAddress,
    addressId:addressId,
    session
  }})
};

const postUpdateAddress = async (req, res) => {
  const {
   params:{addressId,userId},
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
  
  res.redirect("/user/"+userId+"/address");
};

const deleteAddress = async (req, res) => {
  const {
    params:{userId}
  } =req;
  await Address.destroy({where:{ id: req.params.addressId}});
  res.redirect("/user/"+userId+"/address");
};

const postRegisterAddress = async (req,res)=>{
  console.log(req.body);
}
module.exports = { getAddress, postAddress,getAddressRegister,postAddressRegister, getUpdateAddress,postUpdateAddress,deleteAddress };
