import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import Post from '../models/stories.model.js'
import { categories } from "../constant.js";
const postStories = asyncHandler(async (req, res) => {
    console.log('postStories route');
    try {
        const postValue = req.body;
        const postCategory=req.body[0].category;
         

        // Validate the incoming data against the Stories model schema
          const validatedStories = postValue.map(story => {
            const { heading, description, image, category } = story;
            if(postCategory!==category){
                throw new ApiError(400, 'Validation failed, All category should be same');   
            }
            if(!heading||!description||!image||!category){
                throw new ApiError(400, 'Validation failed,All feilds are required');
            }
            return {
              heading,
              description,
              image,
              category
            };
          });
      
          // Save the validated stories to the database
          const post = new Post({
            category: postCategory,
            stories: validatedStories,
          });
          const savedPost = await post.save();
console.log(savedPost);
      
      
      res
        .status(201)
        .json(new ApiResponse(200, savedPost, "post created successfully"));
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            throw new ApiError(400, 'Validation failed', errors);
          }
      
          // Handle other errors
          console.error('Error:', error);
      
      throw new ApiError(
        error.statusCode || 500,
        error.message || "post creating not success",
        error.error
      );
    }
  });
  const getStories = asyncHandler(async (req, res) => {
    console.log('get stories');
    try {
        // Fetch distinct categories from the database
        // const categories = await Post.distinct('category');
        const categoriesValue=categories;

        // Define an empty object to store posts by category
        const featuredPosts = {};
  
        // Loop through each category and fetch 8 posts
        for (const category of categoriesValue) {   
            // Fetch 8 posts for each category
            const posts = await Post.find({ category }).limit(8).sort({ createdAt: -1 });

            // Add the fetched posts to the featuredPosts object
            featuredPosts[category] = posts;
        }
        // Return the featuredPosts object
        res.status(200).json(new ApiResponse(200, featuredPosts, "Successfully fetched featured posts"));
    } catch (error) {
        console.error('Error:', error);
        
        // Handle errors
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Failed to fetch featured posts",
            error.error
        );
    }
});
  const getNextStories = asyncHandler(async (req, res) => {
    console.log('get Next Stories');
    const {postIndex,postIndexLimit,category}=req.query
    console.log(postIndex,postIndexLimit,category);
    const singleIndex = Array.isArray(postIndex) ? postIndex[0] : postIndex;
    try {
        // Fetch distinct categories from the database
        // const categories = await Post.distinct('category');
        const categoriesValue=categories;

        // Define an empty object to store posts by category
        const featuredPosts = {};
  
        // Loop through each category and fetch 8 posts
        for (const category of categoriesValue) {   
            // Fetch 8 posts for each category
            const posts = await Post.find({ category }).limit(8).sort({ createdAt: -1 });

            // Add the fetched posts to the featuredPosts object
            featuredPosts[category] = posts;
        }
        // Return the featuredPosts object
        res.status(200).json(new ApiResponse(200, featuredPosts, "Successfully fetched featured posts"));
    } catch (error) {
        console.error('Error:', error);
        
        // Handle errors
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Failed to fetch featured posts",
            error.error
        );
    }
});

  export {postStories,getStories,getNextStories}