const User = require('../models/userModel');
const bcrypt = require('bcrypt');


const registerLoad = async(req,res)=>{
    try{
        res.render('register');
    }catch(error){
        console.log(error);
    }
}

const register = async(req,res)=>{
    try{
        const passwordHash = await bcrypt.hash(req.body.password,10);

        const user = new User ({
            name: req.body.name,
            email: req.body.email,
            image: 'images/'+req.file.filename,
            password: passwordHash 

        });

        await user.save();

        res.render('register',{message: 'Registration successfully completed'});
    }catch(error){
        console.log(error);
    }
}

const loadLogin = async(req, res) => {
    try{
        res.render('login');
    } catch(error){
        console.log(error);
    }
} 
const login = async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email:email });
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch) {
                req.session.user = userData;
                res.redirect('/dashboard');
            } else res.render('login',{message:'Email and Password is Incorrect!'});
        }else res.render('login',{message:'Email and Password is Incorrect!'});
        
    } catch(error){
        console.log("Login Error: ")
        console.log(error);
    }
}

const logout = async(req, res) => {
    try{
        req.session.destroy();
        res.redirect('/');
    } catch(error){
        console.log(error);
    }
} 
const loadDashboard = async(req, res) => {
    try{
        var users = await User.find({_id: {$nin:[req.session.user._id]}});
        res.render('dashboard',{user: req.session.user, users:users});
    } catch(error){
        console.log("Dashboard Error: ")
        console.log(error);
    }
} 

module.exports = {
    registerLoad,
    register,
    loadLogin,
    logout,
    login,
    loadDashboard
}