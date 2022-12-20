const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const { mongooseToObject } = require('../../config/utility/mongoose')
const { multipleToObject } = require('../../config/utility/mongoose');

// [GET] /login
const showLogin = async(req, res, next) => {
    // const userInfo = await User.findById(req.user._id)
    res.render('TabLogin/login', { layout: 'mainClient.hbs', user: mongooseToObject(req.user), userInfo: req.user });
}

module.exports = { showLogin }

// [POST] /login/loginStore
// const loginStore = async(req, res, next) => {
//     // const user = await User.findOne({ email: req.body.email });
//     // if (!user) {
//     //     req.session.message = {
//     //         type: 'danger',
//     //         intro: 'Email không tồn tại !',
//     //     }
//     //     return res.redirect('/login');
//     // };

//     //Generate AccessToken
//     // const generateAccessToken = (req, res, next) => {
//     //     return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "30s" });
//     // }

//     //Generate RefeshToken
//     // const generateRefeshToken = (req, res, next) => {
//     //     return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_REFESH_TOKEN, { expiresIn: "365s" });
//     // }

//     const checkPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!checkPassword) {
//         req.session.message = {
//             type: 'danger',
//             intro: 'Mật khẩu không đúng !',
//         }
//         return res.redirect('/login');
//     } else {
//         // Create jwt
//         const data = await req.body;
//         let accessToken = generateAccessToken(user);
//         let refeshToken = generateRefeshToken(user);
//         const { password, ...other } = data;
//         res.cookie('Authorization', accessToken, { httpOnly: true, secure: false, maxAge: 30 })

//         if (user.role == 'admin') return res.redirect('/admin')
//             // return res.send(`User ${user.name} has logged in`);
//         return res.render('TabCustomer/cusPage', { layout: 'mainClient.hbs' });

//         // res.status(200).json({...other, accessToken });

//         // try {
//         //     res.cookie('Authorization', 'Bearer ' + accessToken, { expires: new Date(Date.now() + 24) });
//         //     console.log(accessToken);
//         // } catch (error) {
//         //     res.json(error)
//         // }

//     }

//     // const user = await User.findOne({email: request.body.email});
//     // if (!user) return response.status(422).send('Email or Password is not correct');

//     // const checkPassword = await bcrypt.compare(request.body.password, user.password);

//     // if (!checkPassword) return response.status(422).send('Email or Password is not correct');

//     // const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: 60 });
//     // response.header('auth-token', token).send(token);
// }