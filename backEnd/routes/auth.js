const express = require('express')
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
var fetchuser=require('../middleware/getuser')

//checking git commit via vsCode

//ROUTE1: create a USER using: POST "/api/auth/". Doesn't require auth
const JWT_SECRET="KeepItRolling";
router.post('/createuser',[
    body('name','Name should have atleast 3 chars').isLength({min:3}),
    body('email', 'Response should be in Email Format').isEmail(),
    body('password','Try a stronger password').isLength({min:5})
], async (req,res)=>{    //request and response

    //if there are errors, return bad request and error

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //Check If there's already someone with this email
    try {
        
    
    
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({errors: "there's someone already with those credentials"});
     
    }
    
    // Secure the password 
    const salt= await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt)

    user = await User.create({
        name:req.body.name,
        password: secPass,
        email: req.body.email,
    })
    const data={
        user:{
            id:user.id
        }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
 
    res.json({authtoken})

    //.then(user=>res.json(user))
    // .catch(err=>console.log(err))
    // res.json({error:'Duplicate Email, type a Unique mail_Id', message: err.message});


    // const user = User(req.body)   
    // user.save()
    // res.send(req.body)
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Some kinda error occured')
    }
     
})

//Route2: Authenticate a user using POST "/api/auth/login". No login required
router.post('/login',[
    body('email', 'type correct credentials').isEmail(),
    body('password','type correct credentials').isLength({min:5}).exists()
], async (req,res)=>{
    //if there are errors, return bad request and error

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password}=req.body;
    try {
        let user = await User.findOne({email});
        if(!User){
            return res.status(400).json({error:"Please try to login with correct creds"});

        }

        const passwordCompare=bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct creds"})
        }

        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        res.json({authtoken})


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error')
    }

})


//Route: Get user detail using POST "/api/auth/getuser". No login required
router.post('/getuser',fetchuser, async (req,res)=>{
    try {
        const userId=req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error')
    }
        
    
})

module.exports = router
