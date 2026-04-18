import express from "express";
import { getUserCredits, getAllProjects, getProjectById, toggleProjectPublic } from "../controllers/userControllers.js";
import { protect } from "../middlewares/auth.js";
const userRouter = express.Router()

userRouter.get('/credits', protect, getUserCredits)
userRouter.get('/projects', protect, getAllProjects)
userRouter.get('/projects/:projectId', protect, getProjectById)
userRouter.put('/publish/:projectId', protect, toggleProjectPublic)

export default userRouter