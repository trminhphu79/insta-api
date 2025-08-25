import { Comment } from "../../models/Comment";
import { Post } from "../../models/Post";

type CreateCommentDto = {
  postId: string;
  authorId: string;
  body: string;
  parentId?: string;
};

export async function createComment(dto: CreateCommentDto) {
  const post = await Post.findByPk(dto.postId);
  if (!post) return null;
  const c = await Comment.create(dto as any);
  post.commentCount += 1;
  await post.save();
  return c;
}

export async function getCommentsByPost(postId: string) {
  return Comment.findAll({ where: { postId }, order: [["createdAt", "ASC"]] });
}

export async function deleteComment(id: string) {
  const c = await Comment.findByPk(id);
  if (!c) return false;
  const post = await Post.findByPk(c.postId);
  await c.destroy();
  if (post && post.commentCount > 0) {
    post.commentCount -= 1;
    await post.save();
  }
  return true;
}
