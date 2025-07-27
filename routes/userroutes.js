const express= require('express');
const authController= require('./../controllers/authcontroller');
const userController= require('./../controllers/friendsController')
const router = express.Router();


router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.use(authController.protect)

router.post('/friend-request/send',userController.sendfreindRequest)
router.post('/friend-request/respond',userController.respondToFriendRequest)

router.get('/notifications',userController.getnotification);
router.get('/friends/count',userController.countFriend);

module.exports=router;