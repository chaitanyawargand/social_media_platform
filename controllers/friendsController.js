const User= require('./../modals/userschema');
const catchAsynch=require('./../utils/catchasynch')
const AppError= require('./../utils/apperror');
const catchasynch = require('./../utils/catchasynch');
const FriendRequest=require('./../modals/Friendschema')

exports.sendfreindRequest=catchAsynch(async(req,res,next)=>{
    const senderId= req.user.id;
    const sender= await User.findById(senderId);
    const {receiverId}= req.body;
    const receiver= await User.findById(receiverId);
    if(!receiver) return next(new AppError('this user not exist for sending request',404));
    if(sender.friends.includes(receiverId)) return next(new AppError('already freind',400));
    const existing = await FriendRequest.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
        ],
        status: { $in: ['pending', 'accepted'] }
    });
    console.log(existing);
       if(existing) return new AppError('request already accepted or pending',400);
   await FriendRequest.create({
     sender:senderId,
     receiver:receiverId,
     status:'pending',
   });
   res.status(200).json({
    status:'success',
    message:'friend request send',
   })
 })

 exports.respondToFriendRequest= catchAsynch(async(req,res,next)=>{
    const {requestId,action}=req.body;
    const request= await FriendRequest.findById(requestId);
    if(!request || request.status==='pending'){
        return next(new AppError('invalid or already handled request'))
    }
    if(action==='accept'){
        request.status='accepted'
     const sender= await User.findByIdAndUpdate(request.sender,{
       $addToSet: { friends: request.receiver }
     })
     const receiver= await User.findByIdAndUpdate(request.receiver,{
       $addToSet: { friends: request.sender }
     })
    }
    if(action==='Decline'){
     request.status='declined';
     await request.save();
    }
    return res.status(200).json({
        status:'success',
       message: `friend request ${action}ed`
    })
 })
 exports.getnotification= catchAsynch(async(req,res,next)=>{
    const notifications=await FriendRequest.find({
        sender:req.user.id,
        status:'pending',
    }).populate('name email')
    .sort({createdAt:-1});
     if(!notifications && !notifications.length===0) return next(new AppError('No pending notification',501))
    res.status(200).json({
        status:"success",
        result:notifications.length,
        notifications,
    })
 })
exports.countFriend = catchasynch(async (req, res, next) => {
  const user = await User.findById(req.user.id); 
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  const friends = Array.isArray(user.friends) ? user.friends.length : 0;

  res.status(200).json({
    status: 'success',
    friends
  });
});
