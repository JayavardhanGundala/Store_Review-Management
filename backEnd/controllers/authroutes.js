import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {db} from "../confi/db.js"

export const register=async(req,res)=>{
    const {name,email,address,password}=req.body
    const hashed=await bcrypt.hash(password,10)
    await db.query(
        "INSERT INTO users(name,email,address,password,role) VALUES(?,?,?,?,?)",
        [name,email,address,hashed,"User"]
    );
    return res.status(201).json({message:"User craeted"})

}
export const login=async(req,res)=>{
   try{
     const {email,password}=req.body
    const [rows]=await db.query(
        "SELECT * FROM users  WHERE email=? ",[email]
    );
    if (rows.length==0){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const valid=await bcrypt.compare(password,rows[0].password)
    if(!valid){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const token=jwt.sign(
        {id:rows[0].id,role:rows[0].role},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    return res.status(200).json({token,role:rows[0].role})

   }
   catch(err){
    return res.status(400).json({message:`${err}`})
   }

}
export const resetPassword=async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    try{
        const [rows]=await db.query(
        "SELECT password FROM users WHERE id=?",[req.user.id]
    )
    const ok=await bcrypt.compare(oldPassword,rows[0].password)
    if(!ok){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const hashed=await bcrypt.hash(newPassword,10)
    await db.query(
        "UPDATE users SET password=? WHERE id=?",[hashed,req.user.id]
    )
    return res.status(200).json({message:"Password Updated"})
    }
    catch(err){
        return res.status(400).json({msg:`${err}`})
    }
}