import { Post, PostVisibility } from "../../models/Post";
import { PostMedia } from "../../models/PostMedia";
import { Like } from "../../models/Like";
import { User } from "../../models/User";
import { db } from "@services/postgres.service";

type CreatePostDto = {
  authorId: string;
  caption?: string | null;
  visibility: "public" | "followers";
  media: Array<{
    url: string;
    type: "image" | "video";
    position?: number;
    width?: number;
    height?: number;
  }>;
};

export async function createPost(dto: CreatePostDto) {
  return db.get().transaction(async (tx) => {
    const post = await Post.create(
      {
        authorId: dto.authorId,
        caption: dto.caption ?? null,
        visibility: dto.visibility as PostVisibility,
      } as any,
      { transaction: tx }
    );
    if (dto.media?.length) {
      await PostMedia.bulkCreate(
        dto.media.map(
          (m) =>
            ({
              ...m,
              position: m.position ?? 0,
              postId: post.id,
            } as any)
        ),
        { transaction: tx }
      );
    }
    return Post.findByPk(post.id, { include: [PostMedia], transaction: tx });
  });
}

export async function getPostById(id: string) {
  return Post.findByPk(id, {
    include: [PostMedia, { model: User, attributes: ["id", "username"] }],
  });
}

export async function updatePost(
  id: string,
  partial: Partial<{ caption: string; visibility: "public" | "followers" }>
) {
  const post = await Post.findByPk(id);
  if (!post) return null;
  if (partial.caption !== undefined) post.caption = partial.caption;
  if (partial.visibility)
    post.visibility = partial.visibility as PostVisibility;
  await post.save();
  return post;
}

export async function deletePost(id: string) {
  const n = await Post.destroy({ where: { id } });
  return n > 0;
}

export async function likePost(postId: string, userId: string) {
  const post = await Post.findByPk(postId);
  if (!post) return null;
  const [like, created] = await Like.findOrCreate({
    where: { userId, postId },
  });
  if (created) {
    post.likeCount += 1;
    await post.save();
  }
  return { liked: true, likeCount: post.likeCount };
}

export async function unlikePost(postId: string, userId: string) {
  const post = await Post.findByPk(postId);
  if (!post) return null;
  const removed = await Like.destroy({ where: { userId, postId } });
  if (removed) {
    post.likeCount = Math.max(0, post.likeCount - 1);
    await post.save();
  }
  return { liked: false, likeCount: post.likeCount };
}
