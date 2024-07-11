const prisma = require("../lib/prisma");

const findOne = async (params) => {
    const user_id = params.user_id;
    console.log(user_id);
    const cart = await prisma.cart.findFirst({
        where: {user_id:user_id},
        include:{cart_details:true}
    })
    return cart;
};

const reset = async (params) => {
    const user_id = params.user_id;
    let message="";
    const cart = await prisma.cart.findFirst({
        where: {user_id:user_id},
    });
    const cart_detail = await prisma.cart_Detail.deleteMany({
        where: {cart_id:cart.id},
    });
    if(cart_detail.count ==0){
        message="All Shopping Cart Deleted";
    }
    return message;
};

const update = async (params) => {
    
};

const deleteProduct = async (params) => {

};

module.exports = { findOne, reset, update, deleteProduct };
