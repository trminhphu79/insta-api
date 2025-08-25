import { Follow } from '../../models/Follow';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { Op } from 'sequelize';

export async function followUser(me: string, followingId: string) {
  if (me === followingId) return { ok: false, code: 400, message: 'CANNOT_FOLLOW_SELF' };
  await Follow.findOrCreate({ where: { followerId: me, followingId } });
  return { ok: true };
}

export async function unfollowUser(me: string, followingId: string) {
  await Follow.destroy({ where: { followerId: me, followingId } });
  return { ok: true };
}

export async function getHomeFeed(params: { me: string; limit: number; cursor: Date | null; }) {
  const { me, limit, cursor } = params;

  const following = await Follow.findAll({ where: { followerId: me } });
  const authorIds = [me, ...following.map(f => f.followingId)];

  const where: any = { authorId: { [Op.in]: authorIds } };
  if (cursor) where.createdAt = { [Op.lt]: cursor };

  const posts = await Post.findAll({
    where,
    include: [{ model: User, attributes: ['id', 'username'] }],
    order: [['createdAt', 'DESC']],
    limit,
  });

  const nextCursor = posts.length ? posts[posts.length - 1].createdAt : null;
  return { items: posts, nextCursor };
}