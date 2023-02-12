const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../configs/jwtToken');
const {validateMongodbId} = require('../utils/validateMongodbId')

const createUser = asyncHandler(async (req,res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser){
        //create a new user
        const newUser = User.create(req.body);
        res.json(newUser);
    }
    else{
        //user already exists
       throw new Error("User Already Exists");
    }
});

const loginUserCtrl = asyncHandler(async(req,res) =>{
    const {email,password} = req.body;
    //check if user exists or not

    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        res.json({
            _id: findUser?.id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?.id),
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});


//update a user
const updateaUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const updateUser  = await User.findByIdAndUpdate(
            id,
            {
                firstname:req?.body?.firstname,
                lastname: req?.body?.lastname,
                email:req?.body?.email,
                mobile:req?.body?.mobile,   
        },
        {
            new:true,
        }
        );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
})

//get all users
const getAllUsers = asyncHandler(async(req,res)=>{
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
})

//get single user
const getSingleUser = asyncHandler(async(req,res) =>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const singleUser = await User.findById(id);
        res.json(singleUser);
        
    }catch(error){
        throw new Error(error);
    }
})

//delete user
const deleteUser = asyncHandler(async(req,res) =>{
    try{
        const {id} =  req.params;
        validateMongodbId(id);
        const singleUser = await User.deleteOne({id:id});
        res.json({
            message: "User Deleted Successfully",
            user:singleUser
        });
    }catch(error){
        throw new Error(error);
    }
})

const blockUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
                new: true,
            }
        );
        res.json("User Blocked Successfully");
    } catch (error) {
        throw new Error(error);
    }
})
const unblockUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new: true,
            }
        );
        res.json("User unblocked Successfully");
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {createUser,
                  loginUserCtrl,
                  getAllUsers,
                  getSingleUser,
                  deleteUser,
                  updateaUser,
                  blockUser,
                unblockUser};