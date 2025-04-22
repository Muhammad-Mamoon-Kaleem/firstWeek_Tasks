import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { User } from '../Models/userModel.js';
import { sendEmail } from '../Utils/sendMail.js';
import encryptPassword from '../Utils/encryption.js';


const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.json({ success: false, message: 'Please provide all required fields' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please provide a valid email address' });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: 'Password length must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });

        const expiresAt = Date.now() + 1 * 60 * 1000;

        if (existingUser) {
            if (!existingUser.isVerified) {
                const confirmationCode = await sendEmail(email, 'Your Verification Code');
                existingUser.confirmationCodeFornewAcc = confirmationCode;
                existingUser.expiresAt = expiresAt;
                await existingUser.save();

                return res.json({ success: false, message: 'User already exists but is not verified. Verification code resent.' });
            }
            if (existingUser.isVerified) {
                
                return res.json({ success: false, message: 'User already exists and verified' });
            }

            return res.json({ success: false, message: 'User already exists with this email' });
        }

        const hashedPassword = await encryptPassword(password)

        const confirmationCode = await sendEmail(email, 'Your Verification Code');

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            confirmationCodeFornewAcc:confirmationCode,
            expiresAt,
            isVerified: false
        });

        await newUser.save();

        console.log(`User created. Verification code sent to ${email}`);
        return res.json({
            success: true,
            message: `User created. Verification code sent to ${email}`,
        });

    } catch (error) {
        console.error('Error in creating user:', error);
        return res.json({ success: false, message: 'Error in creating user' });
    }
};


const loginUser = async (req,res)=>{
   try {
    const {email,password} = req.body;
    if(!email || !password ){
        return res.json({success:false,message:'email or password is missing'})
    }
    const user = await User.findOne({email});
    
    if(!user){
        console.log('User did not exists with this email',email);
        return res.json({success:false,message:`User did not exists with this email ${email}`})
    }

    if(!user.isVerified){
        console.log('User is not verified. Plz verify before login.');
        return res.json({success:false,message:'User is not verified. Plz verify before login.'})
    }

    const matchPassword = await bcrypt.compare(password,user.password);
    if(matchPassword){
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_kEY)
        console.log('login successfully', token);
        return res.json({ success: true,message:'Login Successfully', token })
    }
    else{    
        return res.json({success:false,message:'Invalid password or credentials'})
    }
   }
    catch (error) {
    console.log('error in login user',error);
    return res.json({success:false,message:`error in login user ${error}`})
   }

}

const changePassword = async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.json({success:false,message:'email or new  password is not provided'})
        }
        const user =await User.findOne({email});
        const expiresAt = Date.now() + 2 * 60 * 1000;
        const hashPassword = await encryptPassword(password);

        if(!user){
            return res.json({success:false,message:'User not found with this email'})
        }

        if(!user.isVerified){
            console.log('Please Verify user before updating password');
            return res.json({success:false,message:'Please Verify user before updating password'})
            
        }

        const confirmationCode = await sendEmail(email, 'Your Verification Code');
        user.confirmationCodeForChangePass = confirmationCode;
        user.expiresAt = expiresAt;
        user.isChangedPassword=true;

        user.tempPasswordHash = hashPassword
        await user.save()
        
        console.log('To updte password plz verify confirmation code',hashPassword);
        return res.json({success:false,message:'To updte password plz verify confirmation code'})
        
    } 
    catch (error) {
        console.log(error);
        return res.json({success:false,message:`error in changing password ${error}`})
    }
}
export {createUser,loginUser,changePassword}