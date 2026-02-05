import express from "express"
import { veriftToken } from "../middleware/auth.js"
const router=express.Router()
import { register,login,resetPassword } from "../controllers/authroutes.js"
import { createUser,dashboard,getstores,getAllUsers} from "../controllers/adminroutes.js"
import { getStores,rateStore } from "../controllers/userroutes.js"
import { allowroles } from "../middleware/role.js"
import { ownerDashBoard } from "../controllers/storeOwner.js"



//authroutes
router.post("/api/auth/register",register)
router.post("/api/auth/login",login)
router.post("/api/auth/resetPassword",veriftToken,resetPassword)


//admin routes
router.post("/api/auth/admin/createUser",veriftToken,allowroles("Admin"),createUser)
router.get("/api/auth/admin/dashboard",veriftToken,allowroles("Admin"),dashboard)
router.get("/api/auth/admin/stores",veriftToken,allowroles("Admin"),getstores)
router.get("/api/auth/admin/getallausers",veriftToken,getAllUsers)


//user routes
router.get("/api/auth/user/getstores",veriftToken,allowroles("User"),getStores)
router.post("/api/auth/user/ratestore",veriftToken,allowroles("User"),rateStore)

//storeowner
router.get("/api/auth/storeowner/greetings",veriftToken,allowroles("StoreOwner"),ownerDashBoard)


export  default router
