import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import Post from '../models/stories.model.js'
import { categories } from "../constant.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

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
  const { postIndex, postIndexLimit, category } = req.query;
  console.log(postIndex, postIndexLimit, category);
  try {
      // Validate postIndex and postIndexLimit
      if (!postIndex || !postIndexLimit || isNaN(postIndex) || isNaN(postIndexLimit)) {
          throw new Error('Invalid post index or limit');
      }
      
      // Parse index and limit values to integers
      const startIndex = parseInt(postIndex);
      const endIndex = parseInt(postIndexLimit);

      // Fetch posts from the database based on the provided index and limit
      const posts = await Post.find({ category })
                              .sort({ createdAt: -1 })
                              .skip(startIndex)
                              .limit(endIndex - startIndex);

      // Check if there are more stories available
      // const moreStoriesAvailable = await Post.findOne({ category }).skip(endIndex).limit(1);

      // Return the fetched posts and the flag indicating more stories availability
      // res.status(200).json(new ApiResponse(200, { posts, moreStoriesAvailable: !!moreStoriesAvailable }, "Successfully fetched next stories"));
      res.status(200).json(new ApiResponse(200, { posts}, "Successfully fetched next stories"));
  } catch (error) {
      console.error('Error:', error);
      
      // Handle errors
      res.status(error.statusCode || 500).json({
          message: error.message || "Failed to fetch next stories",
          error: error.error
      });
  }
});


const getStoryById = asyncHandler(async (req, res) => {
  console.log('Get Story By ID');
  const { id } = req.params;

  try {
      // Fetch the story from the database based on the provided ID
      const story = await Post.findById(id);

      if (!story) {
          throw new Error('Story not found');
      }

      // Return the fetched story
      res.status(200).json(new ApiResponse(200, story, "Successfully fetched story by ID"));
  } catch (error) {
      console.error('Error:', error);

      // Handle errors
      res.status(error.statusCode || 500).json({
          message: error.message || "Failed to fetch story by ID",
          error: error.error
      });
  }
});

const likeStory = asyncHandler(async (req, res) => {
  console.log('Like Story');
  const { id } = req.params;
  const userId = req.user.id;
  console.log(userId);
  if(!id||!userId){
    throw new Error('story and user id required');
  }  

  try {
    // Find the story by ID
    const story = await Post.findById(id);

    if (!story) {
      throw new Error('Story not found');
    }

    // Check if the user has already liked the story
    const isLiked = story.likedBy.some((likedUserId) => likedUserId.toString()===userId);

    if (isLiked) {
      // If user has already liked the story, unlike it
      let likedStory = story.likedBy.filter((likedUserId) =>{
        likedUserId=likedUserId.toString()
        return likedUserId!==userId
      })
      // story.likedBy = story.likedBy.filter(likedUserId => !likedUserId.equals(ObjectId(userId)));
       story.likedBy=likedStory
    } else {
      // If user has not liked the story yet, like it
      story.likedBy.push(userId);
    }

    // Save the updated story
    const updatedStory = await story.save();

    // Return the updated story
    res.status(200).json(new ApiResponse(200, updatedStory, isLiked ? "Story unliked successfully" : "Story liked successfully"));
  } catch (error) {
    console.error('Error:', error);

    // Handle errors
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to like/unlike story",
      error: error.error
    });
  }
});
const bookmarkStory = asyncHandler(async (req, res) => {
  console.log('bookmark Story');
  const { id } = req.params;
  const userId = req.user.id;
  console.log(userId);
  if(!id||!userId){
    throw new Error('story and user id required');
  }  

  try {
    // Find the story by ID
    const story = await Post.findById(id);

    if (!story) {
      throw new Error('Story not found');
    }

    // Check if the user has already liked the story
    const isSaved = story.savedBy.some((savedUserId) => savedUserId.toString()===userId);

    if (isSaved) {
      // If user has already save the story, unsave it
      let savedStory = story.savedBy.filter((savedUserId) =>{
        savedUserId=savedUserId.toString()
        return savedUserId!==userId
      })
      // story.likedBy = story.likedBy.filter(likedUserId => !likedUserId.equals(ObjectId(userId)));
       story.savedBy=savedStory
    } else {
      // If user has not liked the story yet, like it
      story.savedBy.push(userId);
    }

    // Save the updated story
    const updatedStory = await story.save();

    // Return the updated story
    res.status(200).json(new ApiResponse(200, updatedStory, isSaved ? "Story unliked successfully" : "Story liked successfully"));
  } catch (error) {
    console.error('Error:', error);

    // Handle errors
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to like/unlike story",
      error: error.error
    });
  }
});


  export {postStories,getStories,getNextStories,getStoryById,likeStory,bookmarkStory}