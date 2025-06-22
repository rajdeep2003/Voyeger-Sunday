const Community = require("../models/createCommunity");
const cloudinary = require("cloudinary").v2;


const createCommunityPost = async (req, res) => {
  try {
    const { destination, experienceTitle, shareyourExperience, userlocation, images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }
    const uploadPromises = images.map(image => {
      return cloudinary.uploader.upload(image, {
        folder: "community_posts",
        resource_type: "auto"
      });
    });

    const uploadedResults = await Promise.all(uploadPromises);
    const imageArrayUrl = uploadedResults.map(result => result.secure_url);

    const newPost = await Community.create({
      destination,
      experienceTitle,
      shareyourExperience,
      imageArrayUrl,
      userlocation,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: newPost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all community posts
const getAllCommunityPosts = async (req, res) => {
  try {
    const posts = await Community.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single post by ID
const getCommunityPostById = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update community post
const updateCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, ...updateData } = req.body;

    if (images && images.length > 0) {
      // Upload new images
      const uploadPromises = images.map(image => {
        return cloudinary.uploader.upload(image, {
          folder: "community_posts"
        });
      });
      const uploadedResults = await Promise.all(uploadPromises);
      updateData.imageArrayUrl = uploadedResults.map(result => result.secure_url);
    }

    const updatedPost = await Community.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete community post
const deleteCommunityPost = async (req, res) => {
  try {
    const post = await Community.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Delete images from Cloudinary
    if (post.imageArrayUrl && post.imageArrayUrl.length > 0) {
      const deletePromises = post.imageArrayUrl.map(url => {
        const publicId = url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`community_posts/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createCommunityPost,
  getAllCommunityPosts,
  getCommunityPostById,
  updateCommunityPost,
  deleteCommunityPost
};