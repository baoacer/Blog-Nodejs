const slugify = require("slugify");
const Post = require("../models/post.model");
const UserService = require("./user.service");
const mongoose = require("mongoose");
const { NotFoundError } = require("../core/error.response");

class PostService {
  static async createPost(payload) {
    const { post_author_id } = payload;
    const author = await UserService.findById(post_author_id);
    if (!author) {
      throw new NotFoundError("User not found");
    }
    const post = await Post.create(payload);
    return post;
  }

  static async getPosts({ cursor, limit = 10 }) {
    console.log(`Cursor: ${cursor}, Limit: ${limit}`);
    const query = {};
    if (cursor && cursor !== "null" && cursor !== "undefined") {
      const cursorObjectId = new mongoose.Types.ObjectId(cursor);
      query._id = { $lt: cursorObjectId };
    }

    const posts = await Post.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $limit: +limit },
      {
        $lookup: {
          from: "users",
          localField: "post_author_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          post_content: 1,
          post_images: 1,
          post_likes: 1,
          post_comments_count: 1,
          post_cover_image: 1,
          "author.fullname": 1,
          "author.profile.avatar": 1,
          createdAt: 1,
        },
      },
    ]);

    const nextCursor = posts.length ? posts[posts.length - 1]._id : null;

    return {
      posts,
      nextCursor,
    };
  }

  static getPostsById = async ({ cursor, limit, authorId }) => {
    try {
      const query = {
        post_author_id: authorId,
      };
      if (cursor && cursor !== "null" && cursor !== "undefined") {
        query._id = { $lt: cursor };
      }

      const posts = await Post.find({ post_author_id: authorId }) 
        .sort({ createdAt: -1 }) 
        .populate("post_author_id", "fullname profile.avatar") 
        .limit(+limit)
        .exec();

      const nextCursor = posts.length ? posts[posts.length - 1]._id : null;

      return {
        posts,
        nextCursor,
      };
    } catch (error) {
      console.error("Error fetching posts by authorId:", error);
      return [];
    }
  };

  static async deletePost(id) {
    try {
      console.log(`Delete post with id: ${id}`);
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        throw new Error("Không tìm thấy bài viết để xóa");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      throw new Error("Lỗi khi xóa bài viết");
    }
  }

  static async updatePost(id, payload) {
    try {
      // Kiểm tra id có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID không hợp lệ");
      }
      // Cập nhật bài viết
      const post = await Post.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      }).lean();

      if (!post) {
        throw new Error("Không tìm thấy bài viết để cập nhật");
      }

      return post;
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      throw new Error(error.message || "Lỗi khi cập nhật bài viết");
    }
  }
  static async searchPost({ keyword }) {
    console.log(`Search post with keyword: ${keyword}`);
    try {
      const post = await Post.find({
        post_content: { $regex: keyword, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .lean();

      return post;
    } catch (error) {
      console.error("Lỗi khi tìm bài viết theo tiêu đề:", error);
    }
  }
}
module.exports = PostService;
