import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all reviews (sorted by newest first)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").order("desc").collect();
    return reviews;
  },
});

// Get reviews by specific user
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return reviews;
  },
});

// Get current user's reviews
export const myReviews = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    return reviews;
  },
});

// Create a new review
export const create = mutation({
  args: {
    bookTitle: v.string(),
    author: v.string(),
    rating: v.number(),
    comments: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const reviewId = await ctx.db.insert("reviews", {
      bookTitle: args.bookTitle,
      author: args.author,
      rating: args.rating,
      comments: args.comments,
      userId: user._id,
      userName: user.name || user.email || "Anonymous",
    });

    return reviewId;
  },
});
