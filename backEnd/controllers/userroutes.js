import { db } from "../confi/db.js";


export const getStores=async (req,res)=>{
    try{
        const [rows]=await db.query(
        " SELECT s.id,s.name,s.address,AVG(r.rating) AS rating FROM stores AS s  LEFT JOIN ratings r ON  s.id=r.store_id GROUP BY s.id"
    )
    return res.status(200).json(rows)
    }
    catch(err){
        return res.status(400).json({message:`${err}`})
    }

}

export const rateStore=async (req,res)=>{
   try{
     const{storeid,rating}=req.body

    await db.query(
        "INSERT INTO ratings (user_id,store_id,rating) VALUES(?,?,?) ON DUPLICATE KEY UPDATE rating=?",[req.user.id,storeid,rating,rating]
    )
    return res.status(200).json({message:"rating created"})
   }
   catch(err){
    return res.status(400).json({message:`${err}`})
   }
}