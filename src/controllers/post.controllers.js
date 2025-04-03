const PostService = require("../services/post.service");
const { SuccessResponse } = require("../core/success.response")


class PostController {
    static async createPost(req, res) {
        new SuccessResponse({
            message: "Create Success",
            metadata: await PostService.createPost(req.body)
        }).send(res)
    }
   
    static async getPosts(req, res) {
        const { cursor, limit } = req.query;
        new SuccessResponse({
            message: "Get All Post Success",
            metadata: await PostService.getPosts({ cursor, limit })
        }).send(res)
    }

    static async getPostById(req, res) {
        const { id } = req.params;
        new SuccessResponse({
            message: "Get Post By Id Success",
            metadata: await PostService.getPostById(id)
        }).send(res)
    }

    static async deletePost(req, res) {
        new SuccessResponse({
            message: "Delete Success",
            metadata: await PostService.deletePost(req.query.id)
        }).send(res)
    }

    static async updatePost(req, res) {
        try {
            const { id } = req.params;
            const payload = req.body;
            const result = await PostService.updatePost(id, req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async searchPost(req, res) {
        new SuccessResponse({
            message: "Search Post Success",
            metadata: await PostService.searchPost(req.params)
        }).send(res)
    }
}

module.exports = PostController


