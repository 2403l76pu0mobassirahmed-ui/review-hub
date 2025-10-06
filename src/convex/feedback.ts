import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all feedback for a specific review
export const getByReview = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_reviewId", (q) => q.eq("reviewId", args.reviewId))
      .order("desc")
      .collect();
    return feedback;
  },
});

// Get all feedback on current user's reviews
export const getMyReviewsFeedback = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get all user's reviews
    const myReviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Get feedback for each review
    const feedbackPromises = myReviews.map(async (review) => {
      const feedbackItems = await ctx.db
        .query("feedback")
        .withIndex("by_reviewId", (q) => q.eq("reviewId", review._id))
        .collect();
      
      return feedbackItems.map((fb) => ({
        ...fb,
        reviewTitle: review.bookTitle,
      }));
    });

    const allFeedback = await Promise.all(feedbackPromises);
    return allFeedback.flat().sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Add feedback to a review
export const create = mutation({
  args: {
    reviewId: v.id("reviews"),
    message: v.string(),
    type: v.union(v.literal("comment"), v.literal("edit_suggestion")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const feedbackId = await ctx.db.insert("feedback", {
      reviewId: args.reviewId,
      userId: user._id,
      userName: user.name || user.email || "Anonymous",
      message: args.message,
      type: args.type,
    });

    return feedbackId;
  },
});
