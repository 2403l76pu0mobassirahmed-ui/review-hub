import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Book reviews table
    reviews: defineTable({
      bookTitle: v.string(),
      author: v.string(),
      rating: v.number(), // 1-5
      comments: v.string(),
      userId: v.id("users"),
      userName: v.string(),
    }).index("by_userId", ["userId"]),

    // Feedback on reviews (comments and edit suggestions)
    feedback: defineTable({
      reviewId: v.id("reviews"),
      userId: v.id("users"),
      userName: v.string(),
      message: v.string(),
      type: v.union(v.literal("comment"), v.literal("edit_suggestion")),
    })
      .index("by_reviewId", ["reviewId"])
      .index("by_userId", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;