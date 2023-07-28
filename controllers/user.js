const { setUser} = require('../service/auth')
const User = require('../models/user')


async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password,
    });
    // return res.render('home');
    return res.redirect('/login');
}

async function handleUserLogin(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({email, password});
    if (!user)
        return res.render("login",{
            error: "Invalid credentials"
        });
    
    const token = setUser(user);
    res.cookie('token', token);
    return res.redirect('/')
}
async function handleUserLogout(req, res) {
    res.clearCookie('token');
    return res.redirect('/login');
}



module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
}

// async function handleUserLogin(req, res) {
//     try{
//         console.log("handle user login")
//         const { email, password } = req.body;
//         if (!email || !password){
//             return res.status(400).send("Please provide email and password");
//         }
//         let foundUser = null ;
//         for (let i= 1;i<=5;++i ){
//             foundUser =await User.findOne({'$or':[{'name':'admin'+String(
//                 i)},{'email':email}]});
//             if (foundUser){
//                 break;
//             }
//         }
//         if (!foundUser){
//             return res.status(401).send("Invalid credentials");
//         }
//         const isMatch = await foundUser.matchPassword(password);
//         if (!isMatch){
//             return res.status(401).send("Invalid credentials");
//         }
//         req.session.user_id = foundUser._id;
//         return res.redirect('/home');
//     }catch(err){
//         console.log(err);
//         res.status(500).send("Something went wrong");
//     }
// }