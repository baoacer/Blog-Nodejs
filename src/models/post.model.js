const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "posts";

const postSchema = new Schema({
    post_author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post_title: { type: String, required: true },
    post_slug: { type: String, required: true, unique: true },
    post_content: { type: String, required: true },
    post_excerpt: { type: String }, // tom tat
    post_categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    post_cover_image: { type: String },
    post_status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    post_published_at: { type: Date },
    post_views: { type: Number, default: 0 },
    post_likes: { type: Number, default: 0 },
    post_user_likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    post_comments_count: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, postSchema);
