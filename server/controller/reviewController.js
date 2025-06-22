const {User} = require("../models/UserSchema");

exports.createReview = async(req,res) => {
  try {
    const {userId} = req.user;
    const {reviewCount} = req.body;
    const userDetails = await User.findById(userId)

    if(!userDetails){
      return res.status(400).json({
        success:true,
        message: "User not found"
      })
    }

    if(!reviewCount){
      return res.status(400).json({
        success:false,
        message:"Please give some Review,Before submiting"
      })
    }

    let calculatedPoints = userDetails.points;
    if(reviewCount > 0 && reviewCount <= 3)calculatedPoints = calculatedPoints + 5;
    else if(reviewCount > 3 && reviewCount < 5) calculatedPoints = calculatedPoints + 50;
    else if(reviewCount == 5)calculatedPoints = calculatedPoints + 100;
    const updatedUser = await User.findByIdAndUpdate(userId,{
      $push:{
        review:reviewCount,
      },
      points:calculatedPoints
    },{new:true});

    return res.status(200).json({
      success:true,
      message:"Review created successfully",
      user: updatedUser
    })
  } catch (error) {
    return res.status(200).json({
      success:false,
      message:error.message
    })
  }
}