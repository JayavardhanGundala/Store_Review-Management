import { db } from "../confi/db.js"
export const ownerDashBoard=async(req,res)=>{
    try{
        const [rows]=await db.query(
        "SELECT s.id AS store_id,s.name AS store_name,u.name AS user_name,r.rating,AVG(r.rating) OVER (PARTITION BY s.id ) AS avg_rating FROM ratings r JOIN  users u ON r.user_id=u.id JOIN stores s ON r.store_id=s.id WHERE s.owner_id=? ",[req.user.id]
    )
    return res.status(200).json(rows)
    }
    catch(err){
        return res.status(400).json({message:`${err}`})
    }
}