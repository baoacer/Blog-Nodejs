const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const userSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "user"], default: "user" },
    profile: {
        avatar: { type: String },
        bio: { type: String },
        social_links: {
            facebook: { type: String },
            twitter: { type: String },
            linkedin: { type: String },
            website: { type: String }
        }
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);
