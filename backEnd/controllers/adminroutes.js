import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { db } from "../confi/db.js"
export const createUser=async(req,res)=>{
    try{
    const {name,email,address,password,role}=req.body
    const hashed=await bcrypt.hash(password,10)
    const [result]=await db.query(
        "INSERT INTO users(name,email,address,password,role) VALUES(?,?,?,?,?)",
        [name,email,address,hashed,role]
    );
    const userId = result.insertId;
    if(role=="storeOwner"){
        await db.query(
            "INSERT INTO stores (name,email,address,owner_id) VALUES(?,?,?,?)",[name,email,address,userId]
        )
    }
    return res.status(201).json({message:"User craeted"})
    }
    catch(err){
        return res.status(400).json({message:`${err}`})
    }

}

export const dashboard=async (req,res)=>{
    try{
        const [[user]]=await db.query("SELECT COUNT(*) AS total FROM users")
        const [[stores]]=await db.query("SELECT COUNT(*) AS total FROM stores")
        const [[ratings]]=await db.query("SELECT COUNT(*) AS total FROM ratings")
        return res.status(200).json({
            users:user.total,
            stores:stores.total,
            ratings:ratings.total

        })

    }
    catch(err){
        return res.status(400).json({message:`${err}`})
    }

}
export const getstores=async(req,res)=>{
    try{
        const [rows]=await db.query(
            "SELECT s.id,s.name,s.email,s.address, COALESCE(AVG(r.rating),0) AS avg_rating FROM stores s LEFT JOIN ratings  r ON r.store_id=s.id GROUP BY s.id,s.name,s.email,s.address"

        )
        return res.status(200).json(rows)

    }
    catch(err){
        return res.status(400).json({message:`${err}`})
    }
}
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
        "SELECT u.id,u.name,u.email,u.address,u.role,COALESCE(AVG(r.rating), 0) AS store_avg_rating FROM users u LEFT JOIN stores s ON s.owner_id = u.id LEFT JOIN ratings r ON r.store_id = s.id GROUP BY u.id, u.name, u.email, u.address, u.role "
    );

    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


