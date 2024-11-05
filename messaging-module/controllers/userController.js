const registerLoad = async(req,res)=>{
    try{
        res.render('register');
    }catch(error){
        console.log(error.message);
    }
}

const register = async(req,res)=>{
    try{

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    registerLoad,
    register
}