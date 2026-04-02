import { Router} from 'express'
import { getProfile, login, logout, register, updateProfile } from '../controller/user.controller.js';

const userRoute = Router();


userRoute.post('/register', register)
userRoute.get('/login', login)
userRoute.get('/logout', logout)
userRoute.patch('/update/profile', updateProfile)
userRoute.get('/profile', getProfile)


export default userRoute


