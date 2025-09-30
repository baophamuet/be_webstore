import { raw } from 'mysql2'
import { Op,Sequelize, where } from 'sequelize';
import db from '../models/index.js'
import bcrypt from 'bcryptjs'


const salt = bcrypt.genSaltSync(10)



let getUser = async(id) => {
    
    let User = await db.users.findOne({where: {id: id,},
        attributes:{exclude:['password','updated_at',]},                         
    })
    if (User) return User
    else {
        let message = `Không tồn tại user người dùng trên hệ thống!`
        return message
    }

}
let allUsers = async() => {
    let Users = await db.users.findAll({where: {role: 'user' },raw:true,
        attributes:{exclude:['password','updated_at',]},
    })
    if (Users) return {Count:Users.length, Users}
    else {
        let message = `Danh sách chưa có user người dùng nào `
        return message
    }
}
let createUser = async(user,file) => {
    let checkuser = await db.users.findOne(
        {
            where:{username: user.username,},
            raw: true,
        });
    console.log(">>>>> muốn tạo ",checkuser)
    
    //let avatar = req.file?.filename;
    if (checkuser) {
        console.log("Tạo không thành công do đã tồn tại username")
        return false
    }
    return new Promise (async(resolve,reject)=>{
        try {
               let hashUserPasswordFromBcrypt = await hashUserPassword(user.password)
                // let test= hashUserPassword(user.pass)
                await db.users.create({
                    username: user.username,
                    password: hashUserPasswordFromBcrypt ,
                    email: user.email,
                    full_name: user.full_name,
                    gender: user.gender,
                    role: user.role ,
                    pathAvatar: user?.pathAvatar || '',
                    created_at: new Date(),
                })
    
               // console.log(user)
                console.log(hashUserPasswordFromBcrypt)
                resolve(true)
        }catch(e){
                reject(e)
        }

    })
}
let deleteUser = async(user) => {
console.log("xóa username này :    ", user.username)
    return new Promise (async(resolve,reject)=>{
        try {
                // let test= hashUserPassword(user.pass)
               let deletedCount =  await db.users.destroy({
                    where: {
                        [Op.or]: [
                            { username: user.username },
                            { email: user.email }
                        ]
                    }
                })
                if (deletedCount > 0) {
                    console.log(`✅ Đã xóa thành công ${deletedCount} user`);
                    resolve(true)
                } else {
                    console.log("❌ Không tìm thấy user để xóa");
                    resolve(false)
                }
                
    
        }catch(e){
                reject(e)
        }

    })
}
let login = async(user) => {
    
    let userlogin = await db.users.findOne(
        {
        where:{username: user.username,},
        raw: true
        });
        console.log("check>> user đăng nhập: ", user)
        console.log("check>> user query: ", userlogin)
    if (!userlogin) {
        console.log(">>>>> case 1") 
        return false}
    else if (await bcrypt.compare(user.password, userlogin.password)) {
        console.log(">>>>> case 2")
        return {data: true,
            username:userlogin.username, 
            role:userlogin.role, 
            id: userlogin.id,
            favoriteProducts: userlogin.favoriteProducts,
            cartProducts: userlogin.cartProducts,
            }}
    else return false
}

let updateUser =  async(user) => {
    let hashUserPasswordFromBcrypt = await hashUserPassword(user.newPassword)
    
    let userDB = await db.users.findOne(
        {
        where:{username: user.username,},
        raw: true
        });
    if ((!userDB) ) return false;
    if (!user.pathAvatar)  {
        await db.users.update(
        {
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    gender: user.gender,
                    role: userDB.role ,
                    updated_at: new Date(),
        },
        {
             where: { username: user.username }
        }
    )
        return {status: true, data: userDB};
    } 
    else if (user.oldPassword === 'null' && user.newPassword === 'null'){
         await db.users.update(
        {
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    gender: user.gender,
                    role: userDB.role ,
                    pathAvatar: user.pathAvatar,
                    updated_at: new Date(),
        },
        {
             where: { username: user.username }
        }
    )
        return {status: true, data: userDB};
    } else if (await bcrypt.compare(user.oldPassword, userDB.password)){
    await db.users.update(
        {
                    username: user.username,
                    password: hashUserPasswordFromBcrypt ,
                    email: user.email,
                    full_name: user.full_name,
                    gender: user.gender,
                    role: userDB.role ,
                    pathAvatar: user.pathAvatar,
                    updated_at: new Date(),
        },
        {
             where: { username: user.username }
        }
    )

        //console.log("check>> user đăng nhập: ", user)
       // console.log("check>> user query: ", userDB)
        return {status: true, data: userDB};
    } else
    {
         console.log("Nhập sai mật khẩu hiện tại")
        return false
    }
        
    
}
let hashUserPassword= (password) => {
    return new Promise(async (resolve,reject) =>{
        try {
            let hash = await bcrypt.hashSync(password,salt)
            resolve(hash)
        }catch(e) {
            reject(e)
        }
    })
}
const addFavoriteProduct = async (userId, productId) => {
  const User = await db.users.findOne({ where: { id: userId } });
  if (!User) return { status: false, message: "Người dùng không tồn tại!" };

  
  let favorites = User.favoriteProducts;
  if (!favorites) favorites = [];
  console.log("Check favorites before adding: ", favorites);
  // Nếu favorites là chuỗi JSON (ví dụ: "[1, 2, 3]"), parse thành mảng
  if (typeof favorites === 'string') {
    try {
      favorites = JSON.parse(favorites);
    } catch (e) {
      favorites = []; // Nếu parse lỗi, gán thành mảng rỗng
    }
  }

  console.log("Check productId to add: ", productId);
  if (favorites.includes(productId)) {
    return { status: false, message: "Sản phẩm đã có trong danh sách yêu thích!" };
    } else favorites.push(productId);
console.log("Check favorites after adding: ", favorites);

  await db.users.update(
    { favoriteProducts: favorites, 
        updated_at: new Date() },
    { where: { id: userId } }
  );

  return { status: true, favorites };
};

// View sản phẩm ưa thích
// Lấy danh sách sản phẩm ưa thích của người dùng
const viewFavoriteProduct = async (userId) => {
    const User = await db.users.findOne({ where: { id: userId } });   
    if (!User) return { status: false, message: "Người dùng không tồn tại!" };
     
    console.log("Check User favoriteProducts: ", User.favoriteProducts);
    let favoriteIds = [];
    if (!User.favoriteProducts) favoriteIds = [];
    if (Array.isArray(User.favoriteProducts)) {
        favoriteIds = User.favoriteProducts.map(Number);
} else if (typeof User.favoriteProducts === 'string') {
    try {
        favoriteIds = JSON.parse(User.favoriteProducts).map(Number);
    } catch (e) {
        console.error("Lỗi parse favoriteProducts:", e);
    }
}

    console.log("Check favoriteIds: ", favoriteIds);
    const favoriteProducts = await db.products.findAll({
    where: {
        id: favoriteIds // WHERE id IN (1, 2, 3)
    },
    })
    if (!favoriteProducts) return { status: false, message: "Không có sản phẩm yêu thích!" };
    console.log("Check favoriteProducts: ", favoriteProducts);
    return { status: true, data: favoriteProducts ,user: User };
}

// Xóa sản phẩm khỏi danh sách yêu thích
const deFavoriteProduct = async (userId, productId) => {    

    const User = await db.users.findOne({ where: { id: userId } }); 
    if (!User) return { status: false, message: "Người dùng không tồn tại!" };
    let favorites = User.favoriteProducts;
    if (!favorites) favorites = [];
    console.log("Check favorites before removing: ", favorites);
    // Nếu favorites là chuỗi JSON (ví dụ: "[1, 2, 3]"), parse thành mảng
    if (typeof favorites === 'string') {
        try {
            favorites = JSON.parse(favorites);
        } catch (e) {
            favorites = []; // Nếu parse lỗi, gán thành mảng rỗng
        }
        }   
    console.log("Check productId to remove: ", productId);
    const index = favorites.indexOf(productId);
    if (index === -1) {
        return { status: false, message: "Sản phẩm không có trong danh sách yêu thích!" };
    }
    favorites.splice(index, 1);
    console.log("Check favorites after removing: ", favorites);
    await db.users.update(
        { favoriteProducts: favorites, 
            updated_at: new Date() },
        { where: { id: userId } }
    );
    return { status: true, favorites };
};

const addCartProduct = async (userId, productId) => {
  const User = await db.users.findOne({ where: { id: userId } });
  if (!User) return { status: false, message: "Người dùng không tồn tại!" };

  
  let cart = User.cartProducts;
  if (!cart) cart = [];
  console.log("Check cart before adding: ", cart);
  // Nếu Cart là chuỗi JSON (ví dụ: "[1, 2, 3]"), parse thành mảng
  if (typeof cart === 'string') {
    try {
      cart = JSON.parse(cart);
    } catch (e) {
      cart = []; // Nếu parse lỗi, gán thành mảng rỗng
    }
  }

  console.log("Check productId to add: ", productId);
  if (cart.includes(productId)) {
    return { status: false, message: "Sản phẩm đã có trong danh sách yêu thích!" };
    } else cart.push(productId);
console.log("Check cart after adding: ", cart);

  await db.users.update(
    { cartProducts: cart, 
        updated_at: new Date() },
    { where: { id: userId } }
  );

  return { status: true, cart };
};

const viewCartProduct = async (userId) => {
    const User = await db.users.findOne({ where: { id: userId } });   
    if (!User) return { status: false, message: "Người dùng không tồn tại!" };
     
    console.log("Check User cartProducts: ", User.cartProducts);
    let Cart = [];
    if (!User.cartProducts) Cart = [];
    if (Array.isArray(User.cartProducts)) {
        Cart = User.cartProducts.map(Number);
    } else if (typeof User.cartProducts === 'string') {
    try {
        Cart = JSON.parse(User.cartProducts).map(Number);
    } catch (e) {
        console.error("Lỗi parse cartProducts:", e);
    }
    }

    console.log("Check Cart: ", Cart);
    const cartProducts = await db.products.findAll({
    where: {
        id: Cart // WHERE id IN (1, 2, 3)
    },
    })
    if (!cartProducts) return { status: false, message: "Không có sản phẩm yêu thích!" };
    console.log("Check cartProducts: ", cartProducts);
    return { status: true, data: cartProducts, user: User };
}

// Xóa sản phẩm khỏi giỏ hàng
const deCartProduct = async (userId, productId) => {

    const User = await db.users.findOne({ where: { id: userId } }); 
    if (!User) return { status: false, message: "Người dùng không tồn tại!" };
    let Cart = User.cartProducts;
    if (!Cart) Cart = [];
    console.log("Check Cart before removing: ", Cart);
    // Nếu Cart là chuỗi JSON (ví dụ: "[1, 2, 3]"), parse thành mảng
    if (typeof Cart === 'string') {
        try {
            Cart = JSON.parse(Cart);
        } catch (e) {
            Cart = []; // Nếu parse lỗi, gán thành mảng rỗng
        }
        }   
    console.log("Check productId to remove: ", productId);
    const index = Cart.indexOf(productId);
    if (index === -1) {
        return { status: false, message: "Sản phẩm không có trong giỏ hàng!" };
    }
    Cart.splice(index, 1);
    console.log("Check Cart after removing: ", Cart);
    await db.users.update(
        { cartProducts: Cart, 
            updated_at: new Date() },
        { where: { id: userId } }
    );
    return { status: true, Cart };
};


let Product = async(ProductId) =>{
    
    let product = await db.products.findOne({where: {id: ProductId,},
        attributes:{exclude:['password','updated_at',]},                         
    })
    if (product) {
        console.log("Check product >>>>  : ",product)
        return product
    }
    else {
        let message = `Không tồn tại sản phẩm người dùng trên hệ thống!`
        return message
    }
}
let allProducts = async() =>{
    let Products = await db.products.findAll({raw:true})
    if (Products)    return Products
    else {
        let message = `Chưa có sản phẩm nào!`
        return message
    }
}

let searchProducts = async(req) =>{
    console.log("Check keyword search: ",req.keyword)
    let Products = await db.products.findAll(
        {
  where: {
    [Op.or]: [
      Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
        [Op.like]: `%${req.keyword.toLowerCase()}%`
      }),
      Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), {
        [Op.like]: `%${req.keyword.toLowerCase()}%`
      })
    ]
  },
        }
    )
    if (Products)    return Products
    else {
        let message = `Chưa có sản phẩm!`
        return message
    }
}
let addProduct = async(product) =>{

    //let product = await checkproduct(Product)


    if (await checkproduct(product)) return false
    await db.products.create({
        name: product.name,
        category_id: product.category_id,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images:product.images,
        created_at: new Date(),
        updated_at: new Date()
    })
    return true

}
let updateProduct = async(product,id) => {

    let productUpdate = await checkproduct(id)
    console.log("Check productUpdate >>>>: ",productUpdate)
    //kiểm tra tồn tại product này chưa 
    if (productUpdate)
    {
        await db.products.update(
        {
        name: product.name,
        category_id: product.category_id,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images:product.images,
        updated_at: new Date(),

        },{
             where: { id: id }
        }
    )
    let datenow=new Date()
        console.log("datetime: ",datenow )
        return productUpdate

    }
    else return false
}
let delProduct = async(ProductId) => {
    let productUpdate = await checkproduct(ProductId)

    //kiểm tra tồn tại product này chưa 
    if (productUpdate)
    {
        await db.products.destroy(
        {
             where: { id: productUpdate.id }
        }
        )
        return true
    }
    else return false
}

let checkproduct = async(ProductId) => {
    let productquery = await db.products.findOne({
    where: { id: ProductId},
    raw:true,
    })
    console.log("Check productquery >>>>: ",productquery)
    if (productquery) {
        return productquery
    }
    else return false
    
}


let displayOrder = async(userId) => {
    
    let userquery = await db.users.findOne({where: {id: userId}, raw:true})
    console.log('>>>>>>>>>>>>>> check user query:   ',userquery)
    console.log('orders associations:', Object.keys(db.orders.associations));
// phải thấy alias bạn đã đặt: ví dụ ['items','user','products'] hoặc ['orderitems',...]

    let order = await db.orders.findAll({
  where: { user_id: userId },
  include: [
    //{ model: db.users, as: 'user' },
    {
      model: db.orderitems,
      as: 'items',
      attributes: ['quantity', 'price'],
      include: [{ 
        model: db.products, as: 'product',
        attributes: ['id','name','images',], 
         
    }]
    }
  ],
  order: [['created_at', 'DESC']],
  raw: false,        // ép trả về instance

});    
   console.log('>>>>>>>>>>>>>> check data:   ',order)
    return {
        message:`Chi tiết các lần order của khách ${userquery.username}`, 
        data: order
    }

}

let displayOneOrder = async(userId, orderId) => {
    let userquery = await db.users.findOne({where: {id: userId}, raw:true})
    console.log('>>>>>>>>>>>>>> check user query:   ',userquery)
    console.log('orders associations:', Object.keys(db.orders.associations));
    // phải thấy alias bạn đã đặt: ví dụ ['items','user','products'] hoặc ['orderitems',...]

    let order = await db.orders.findOne({
  where: { id: orderId },
  attributes: ['id', 'phone', 'address', 'status', 'payment', 'created_at'],
  include: [
    {
      model: db.orderitems,
      as: 'items',
      attributes: ['id', 'quantity', 'price', 'created_at'],
      include: [
        {
          model: db.products,
          as: 'product',
          attributes: ['id', 'name', 'images']
        }
      ]
    }
  ],
  order: [['created_at', 'DESC']],
  raw: false // để trả về instance kèm data lồng nhau
});
  
   console.log('>>>>>>>>>>>>>> check data:   ',order)
   if (!order || order.length === 0) {
    console.log(`message: false\nKhông tìm thấy đơn hàng hoặc đơn hàng rỗng`);
    return {
        message: false,
        data: null
    }
    } 
   return {
        message:`Chi tiết các lần order của khách ${userquery.username}`, 
        data: order
    }

}

let createOrder = async (userId, payload) => {
  try {
    console.log("👉 Bắt đầu tạo order với payload:", payload);

    const order = await db.orders.create({

      user_id: userId,
      total_price: payload.total_price,
      status: "pending",
      payment: false,
      paymentmethod: payload.paymentmethod,
      phone: payload.phone,
      address: payload.address,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    console.log("✅ Order đã tạo:", order.toJSON());
    // truy cập sau khi tạo đơn thành công
    console.log("👉 Order ID:", order.id);
    console.log("👉 Order plain:", order.get({ plain: true }));

    let arrItems = payload.items;
    console.log("👉 Danh sách items để tạo orderitems:", arrItems);

    // Lặp qua mảng items và tạo bản ghi trong bảng orderitems
    for (const item of arrItems) {
      try {
        const orderItem = await db.orderitems.create({
          order_id: order.id,
          product_id: item.id,
          quantity: item._qty,
          price: item._lineTotal,
          created_at: new Date(),
          updated_at: new Date(),
        });
        console.log("✅ Order item đã tạo:", orderItem.toJSON());
      } catch (err) {
        console.error("❌ Lỗi khi tạo order item:", err.message);
        console.error(err); // log full stack Sequelize/MySQL
      }
    }

    return {
        status: true, 
        data: order
    };
  } catch (err) {
    console.error("❌ Lỗi khi tạo order:", err.message);
    console.error(err); // log full stack Sequelize/MySQL
    return false;
  }
};
let allOrders = async() => {
    
    let order = await db.orders.findAll({
    include: [
    {
      model: db.orderitems,
      as: 'items',
      attributes: ['quantity', 'price'],
      include: [{ 
        model: db.products, as: 'product',
        attributes: ['id','name','images',], 
         
    }]
    }
  ],
  order: [['created_at', 'DESC']],
  raw: false,        // ép trả về instance

});    
   console.log('>>>>>>>>>>>>>> check data:   ',order)
    return {
        message:`Lấy tất cả đơn hàng`, 
        data: order
    }

}
let updateOrder = async (orderId,data) => {
    const checkOrder = await db.orders.findByPk(orderId);
    const allowed = ['status', 'payment', 'paymentmethod'];
    if (!checkOrder) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  try {
    console.log("Check orderId:", orderId);
    console.log("Check data thay đổi:", data);
    const updates = Object.fromEntries(
    Object.entries(data).filter(([k, v]) => allowed.includes(k) && v !== undefined)
    );

    const status = await db.orders.update(data,
    { where: { id: orderId } }
    );
    
    console.log("✅ Order đã cập nhật:", status);
    return true;
  } catch (err) {
    console.error("❌ Lỗi khi tạo order:", err.message);
    console.error(err); // log full stack Sequelize/MySQL
    return false;
  }
};


export default {
    displayOrder,
    displayOneOrder,
    createOrder,
    allOrders,
    updateOrder,
    getUser,
    allUsers,
    createUser,
    deleteUser,
    login,
    updateUser,
    Product,
    allProducts,
    addProduct,
    updateProduct,
    delProduct,
    addFavoriteProduct,
    addCartProduct,
    viewCartProduct,
    viewFavoriteProduct,
    deFavoriteProduct,
    deCartProduct,
    searchProducts,
}