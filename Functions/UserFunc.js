import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import UserSchema from "../models/user.js";




export const personalprofile = async (req, res)=>{
    const user = await UserSchema.findById(req.userId);
    res.render ("pages/me",{role: user.role});
}


export const patchUser = async (req, res)=>{
    try {
        const user = await UserSchema.findById(req.id);
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        UserSchema.updateOne({
                id: req.id
            },
            {
                $set: {
                    name: req.body.name,
                    surname: req.body.surname,
                    number: req.body.number,
                    email: req.body.email,
                    password : hashpassword
                }
            }
            )
        res.status(200);
    }catch (error){
        res.status (404);
    }
}

export const profileroutes = async (req, res)=>{

}
export const register = async (req,res)=>{
    console.log('aboba');
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            surname: req.body.surname,
            name: req.body.name,
            email: req.body.email,
            number : req.body.number,
            dateOfBirth: req.body.dateOfBirth,
            password: hashpassword,
            sex: req.body.sex,
            role: 'passenger',
        })

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        },'aboba')
        res.json({
            ...user.toJSON(),
            token});
        res.status(200);
        res.cookie('name', user.toJSON().name);
        res.cookie('jwt',token);
    }catch (err){
        res.status(500).json({message: "Не удалось зарегистрироваться((",});

    }
}


export const registerdriver = async (req,res)=>{
    console.log('aboba');
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            surname: req.body.surname,
            name: req.body.name,
            email: req.body.email,
            number : req.body.number,
            dateOfBirth: req.body.dateOfBirth,
            password: hashpassword,
            sex: req.body.sex,
            role: 'driver',
            carModel: req.body.carModel,
            carNumber : req.body.carNumber,
            licensePlateNumber : req.body.licensePlateNumber
        })
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        },'aboba')
        res.json({
            ...user.toJSON(),
            token});
        res.status(200).json({message:"Вы успешно зарегистрированы!"});
        res.cookie('name', user.toJSON().name);
        res.cookie('jwt',token);
    }catch (err){
        res.status(500).json({message: "Не удалось зарегистрироваться((",});
    }
}

export const login = async (req, res)=>{
    console.log("Прилетел запрос");
    try{
        const User = await UserModel.findOne({number: req.body.number});
        if (!User){
            throw new Error();
        }
        const isValidPass = await bcrypt.compare(req.body.password, User.toJSON().password);
        if (!isValidPass){
            throw new Error();
        } else{
            const token = jwt.sign({
                _id: User._id,
            },'aboba')
            res.cookie('name', User.toJSON().name);
            res.cookie('jwt',token);
            res.json({
                ...User.toJSON(),
                token});
            res.status(200);
        }
    }
    catch (err){
        console.log(err);
        res.status(404).json({message: "Не удалось авторизироваться"})
    }

}

export const me = async (req,res)=>{
    try{
        const User =    await UserModel.findById(req.userId);
        const token = jwt.sign({
            _id: User._id,
        },'aboba')
        res.json({
            ...User.toJSON(),
            token});
        res.status(200);
    }catch(err){

        res.status(404);
        res.message("NOT FOUND");
    }
}


export const stats = async (req, res)=>{

}