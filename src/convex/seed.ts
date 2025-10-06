import { internalMutation } from "./_generated/server";

export const seedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingReviews = await ctx.db.query("reviews").collect();
    if (existingReviews.length > 0) {
      console.log("Data already seeded");
      return { message: "Data already exists" };
    }

    // Create test users (we'll use the first authenticated user or create anonymous ones)
    const users = await ctx.db.query("users").collect();
    
    if (users.length === 0) {
      console.log("No users found. Please sign up first.");
      return { message: "Please create a user account first" };
    }

    const testUser = users[0];

    // Sample book reviews
    const reviews = [
      {
        bookTitle: "The Midnight Library",
        author: "Matt Haig",
        rating: 5,
        comments: "An absolutely captivating exploration of life's infinite possibilities. Haig masterfully weaves philosophy with storytelling, creating a narrative that's both thought-provoking and emotionally resonant. The concept of the midnight library is brilliant, and Nora's journey through different lives is deeply moving.",
        userId: testUser._id,
        userName: testUser.name || testUser.email || "Book Lover",
      },
      {
        bookTitle: "Project Hail Mary",
        author: "Andy Weir",
        rating: 5,
        comments: "Andy Weir has done it again! This book is a perfect blend of hard science fiction and humor. The protagonist's problem-solving approach is engaging, and the unexpected friendship that develops is heartwarming. Couldn't put it down!",
        userId: testUser._id,
        userName: testUser.name || testUser.email || "Book Lover",
      },
      {
        bookTitle: "Atomic Habits",
        author: "James Clear",
        rating: 4,
        comments: "A practical and insightful guide to building better habits. Clear's framework is easy to understand and implement. The 1% improvement philosophy is powerful. Some concepts felt repetitive, but overall an excellent resource for personal development.",
        userId: testUser._id,
        userName: testUser.name || testUser.email || "Book Lover",
      },
      {
        bookTitle: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        rating: 5,
        comments: "A stunning piece of historical fiction that explores love, identity, and sacrifice. Reid's character development is exceptional, and Evelyn Hugo is one of the most complex and fascinating protagonists I've encountered. The twists kept me guessing until the end.",
        userId: testUser._id,
        userName: testUser.name || testUser.email || "Book Lover",
      },
      {
        bookTitle: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        rating: 4,
        comments: "A comprehensive look at how our minds work and the biases that affect our decision-making. Kahneman's research is fascinating, though the book can be dense at times. Essential reading for anyone interested in psychology and behavioral economics.",
        userId: testUser._id,
        userName: testUser.name || testUser.email || "Book Lover",
      },
    ];

    // Insert reviews
    const reviewIds = [];
    for (const review of reviews) {
      const id = await ctx.db.insert("reviews", review);
      reviewIds.push(id);
    }

    console.log(`Seeded ${reviewIds.length} reviews`);
    return { message: `Successfully seeded ${reviewIds.length} reviews` };
  },
});
