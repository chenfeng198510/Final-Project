const axios = require('axios');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const Profile = require('../models/profile');
require('dotenv').config();
const PUBLISHER_KEY = process.env.PUBLISHER_KEY
const SECRET_KEY = process.env.SECRET_KEY
const sgMail =require('@sendgrid/mail');
const { claimCheck } = require('express-openid-connect');
const sendGridApiKey = process.env.SENDGRID_API_KEY
const stripe = require('stripe')(SECRET_KEY);

//Trigger product_index to go to Index Page
const product_index = async (req, res)=> {
    let isAuthenticated = req.oidc.isAuthenticated();

    if(isAuthenticated) {
        const user = {
            user_id: req.oidc.user.sub,
            name: req.oidc.user.name,
            email:req.oidc.user.email,
            picture: req.oidc.user.picture,
        }
        const email1 = req.oidc.user.email;
        console.log(email1);
        const doc = await User.findOne({ email:email1 });
            console.log(doc);
            if (doc != null) {
            }else{
                const user2 = new User(user);
                user2.save();
            }
      Product.find().sort({
          createdAt: -1
      }).then(result => {
          res.render("index", { 
              add: result,
              title: "My auth app",
              isAuthenticated: isAuthenticated,
                key: PUBLISHER_KEY,
           });
      });
      } else {
      res.render("noindex", { 
          title: "My auth app",
          isAuthenticated: isAuthenticated
       });
    }
  }

  //secured enpoint and get localhost:5000 API SERVER
const secured_endpoint = async (req, res)=> {
    let data ={}
    const {token_type, access_token} = req.oidc.accessToken;
    try{
        const apiResponse = await axios.get('http://localhost:5000/private',
        {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        data =apiResponse.data;
    }catch(e){
        console(e);
    
    }
        
    res.render("secured", { 
        title: "Secured Page",
        isAuthenticated: req.oidc.isAuthenticated(),
        data
    });
}

//Role based authentication,get token and if role is admin,render to create page.
const role_based_authentication = async(req,res) => {
    let data = {};
    
const { token_type, access_token } = req.oidc.accessToken;

try{
    // calling the server to get the data, make sure you get the data before moving forward(async, await)
    const apiResponse = await axios.get('http://localhost:5000/role', {
        headers: {
            authorization: `${token_type} ${access_token}`
        }
    });
    data = apiResponse.data;
    const order2= req.oidc.user.email;
    Product.find({owner:order2}).sort({
        createdAt: -1
    }).then(result => {
        res.render("create", { 
        title: 'Host User', 
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        data: data,
        add: result,
         });
    });
 // when there is not error, you will be redirected to the secured page with the data you get fromt the api
}catch(e) {
    console.log(e);
    res.render('notaccess', {
        title: 'Not Access Page',
        isAuthenticated: req.oidc.isAuthenticated()
      });
}
}

//create product
const product_create_post = (req,res) =>{
    console.log(req.oidc.user.picture);
    const product1 = {
        name: req.body.name,
        owner: req.oidc.user.email,
        address:req.body.address,
        city:req.body.city,
        price:req.body.price,
        image:req.body.image,
        ownerimage:req.oidc.user.picture,
    }
    const product = new Product(product1);
    product.save()
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
    console.log(req.body);
}

//trigger to render to edit page
const product_edit_view = (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('edit', {
                product: result,
                title: "Product Edit",
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user
            });
        })
        .catch(err => {
            console.log("Error ", err);
        })
}

//update products' information
const product_update = async (req, res) => {
    const _id = req.params.id;
    //console.log(_id);
    const doc = await Product.findOne({ _id });
// Overwrite
    doc.overwrite({
        name: req.body.name,
        image: req.body.image,
        address: req.body.address,
        city: req.body.city,
        price: req.body.price
    })

    await doc.save()
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        console.log("ERROR ", err);
    })
}

//Delete 
const product_delete = async (req,res)=>{
    Product.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/");
        }else {
            res.redirect("/");
            sgMail.setApiKey(sendGridApiKey);
const msg ={
    to:"chenfeng198510@gmail.com",
    from:"chenfeng198510cibc@gmail.com",
    subject:"Deleted",
    text:"Deleted",
    html:"<strong>Your product or service has been deleted!</strong>"
}
//send an email when delete products
sgMail.send(msg);
            }
    })
  }

  //render to contactus page
const contact_us = (req, res)=> {
    let isAuthenticated = req.oidc.isAuthenticated();
    res.render("contactus", { 
        title: "Contact Us",
        isAuthenticated: isAuthenticated
     });
}

//Building new feature


//trigger button of "payment with card" to pay
const product_payment = (req, res) => {
    console.log(req.body.finalprice);
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.body.stripeName,
        address: {
            line1: '470 Irmin St',
            postal_code: 'V5J1H2',
            city: 'Burnaby',
            state: 'BC',
            country: 'Canada',
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: req.body.finalprice,
                description: "Product Development",
                currency: "USD",
                customer: customer.id
            })
        })
        .then((charge) => {
            res.render('payment_success', { 
                title: "Payment Success", 
            });
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        })
}

//select product and render to order page
const product_order =  (req, res) => {
    let isAuthenticated = req.oidc.isAuthenticated();
    const id = req.params.id;
    if(isAuthenticated) {
     Product.findById(id)
      .then(result => {
          res.render("order", {
               product: result, 
              title: "Order",
              isAuthenticated: isAuthenticated,
                key: PUBLISHER_KEY,
                user: req.oidc.user,
           });
      });
      } else {
      res.render("noindex", { 
          title: "My auth app",
          isAuthenticated: isAuthenticated
       });
    }
}
 
//testing
const role_based_authentication3 = claimCheck((req, claims) => {
    console.log(claims);
    
});

//order button
const order_create_post = (req,res) =>{
    const order1 = {
        insurance: req.body.insurance,
        user: req.oidc.user.email,
        startdate:req.body.startdate,
        enddate:req.body.enddate,
        name:req.body.name,
        price:req.body.price,
        address:req.body.address,
        image:req.body.image,
    }
    const order = new Order(order1);
    let isAuthenticated = req.oidc.isAuthenticated();

    order.save()
    //render to confirm
    .then(result => {
        res.render("confirm", {
               product: result, 
                user: req.oidc.user,
                isAuthenticated: isAuthenticated,
                key: PUBLISHER_KEY,
           });
    })
    .catch(err => {
        console.log(err);
    });
}
const orderhistory = (req,res) =>{
    let isAuthenticated = req.oidc.isAuthenticated();
    const order2= req.oidc.user.email;
    const order3 = Order.find({user:order2});
    order3.then(result => {
        res.render("Orderhistory", {
               order: result, 
                user: req.oidc.user,
                isAuthenticated: isAuthenticated,
             
           });
    })
    .catch(err => {
        console.log(err);
    });
}


const personal_profile = async (req, res) => {
    let isAuthenticated = req.oidc.isAuthenticated();
    const id = req.params.id;
    const user4 = User.findById(id);
    const emailp = req.oidc.user.email;
    const docp = await Profile.findOne({ email:emailp });
    if(docp != null) {
        const profile2= req.oidc.user.email;
        console.log(profile2);
    const profile3 = Profile.findOne({email:profile2});
        profile3.then(result => {
          res.render("profile", {
               profile: result, 
              title: "Personal Profil",
              isAuthenticated: isAuthenticated,
                user: req.oidc.user,
           });
      });
      } else {
        user4.then(result => {
            res.render('useredit', {
                profile: result,
                title: "User Edit",
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user,
            });
        })
        .catch(err => {
            console.log("Error ", err);
        });
    }
}



const user_edit = (req, res) => {
    const id = req.params.id;
    const user4 = User.findById(id);
        user4.then(result => {
            res.render('useredit', {
                profile: result,
                title: "User Edit",
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user,
            });
        })
        .catch(err => {
            console.log("Error ", err);
        });

}

//update user' information
const user_update = async (req, res) => {
    const email2 = req.oidc.user.email;
    const doc3 = await Profile.findOne({ email:email2 });
    if(doc3 != null) {
// Overwrite
    doc3.overwrite({
        nickName: req.body.nickName,
        picture: req.body.picture,
        occupation:req.body.occupation,
        city: req.body.city,
        country:req.body.country,
        birthday:req.body.birthday,
        phone1: req.body.phone1,
        phon2:req.body.phone2,
        email:req.oidc.user.email,
        petname: req.body.petname,
        pettype: req.body.pettype,
        petimage: req.body.petimage,
        petname2: req.body.petname2,
        pettype2: req.body.pettype2,
        petimage2: req.body.petimage2,
        petname3: req.body.petname3,
        pettype3: req.body.pettype3,
        petimage3: req.body.petimage3,
        petname4: req.body.petname4,
        pettype4: req.body.pettype4,
        petimage4: req.body.petimage4,
    })
    await doc3.save()
    .then(() => {
        res.redirect('profile');
    })
    .catch(err => {
        console.log("ERROR ", err);
    });
}else{    
    const doc4 = {
        nickName: req.body.nickName,
        picture: req.body.picture,
        occupation:req.body.occupation,
        city: req.body.city,
        country:req.body.country,
        birthday:req.body.birthday,
        phone1: req.body.phone1,
        phon2:req.body.phone2,
        email:req.oidc.user.email,
        petname: req.body.petname,
        pettype: req.body.pettype,
        petimage: req.body.petimage,
        petname2: req.body.petname2,
        pettype2: req.body.pettype2,
        petimage2: req.body.petimage2,
        petname3: req.body.petname3,
        pettype3: req.body.pettype3,
        petimage3: req.body.petimage3,
        petname4: req.body.petname4,
        pettype4: req.body.pettype4,
        petimage4: req.body.petimage4,
}
const doc5 = new Profile(doc4);
doc5.save()
//render to confirm
.then(result => {
    res.redirect('profile');
})
.catch(err => {
    console.log(err);
});
}
}

const order_confirm = (req, res) => {
    const id = req.params.id;
    Order.findByIdAndUpdate(id, {status:'Confirmed'},
    function (err) {
if (err){
console.log(err);
res.redirect('/');
}
else{
console.log("Updated User : ");
res.redirect('/orderhistory');
}
        });
}

const order_cancel = (req, res) => {
    const id = req.params.id;
    Order.findByIdAndUpdate(id, {status:'Canceled'},
    function (err) {
if (err){
console.log(err);
res.redirect('/');
}
else{
console.log("Updated User : ");
res.redirect('/orderhistory');
}
        });
}

module.exports = {
product_index,
secured_endpoint,
role_based_authentication,
product_create_post,
product_edit_view,
product_update,
product_delete,
contact_us,
product_payment,
product_order,
role_based_authentication3,
order_create_post,
personal_profile,
orderhistory,
user_edit,
user_update,
order_confirm,
order_cancel,
}