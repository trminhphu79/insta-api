import { Op } from "sequelize";
import { z } from "zod";
import { User } from "../../models/User";
import { Follow } from "../../models/Follow";
import { Post } from "../../models/Post";

export const createUserDto = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(10),
});

export const updateUserDto = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  displayName: z.string().max(80).optional(),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function createUser(input: z.infer<typeof createUserDto>) {
  const user = await User.create(input as any);
  return sanitize(user);
}

export async function loginUser(input: { email: string; password: string }) {
  const u = await User.findOne({
    where: { email: input.email, password: input.password },
  });
  return u
    ? {
        data: { ...sanitize(u), accessToken: "xxx", refreshToken: "xxxx" },
        message: "Login success",
      }
    : null;
}

export async function getUserById(id: string) {
  const u = await User.findByPk(id);
  return u ? sanitize(u) : null;
}

export async function getUserByUsername(username: string) {
  const u = await User.findOne({ where: { username } });
  return u ? sanitize(u) : null;
}

export async function updateUser(
  id: string,
  partial: z.infer<typeof updateUserDto>
) {
  const u = await User.findByPk(id);
  if (!u) return null;

  if (partial.username !== undefined) u.username = partial.username;
  if (partial.email !== undefined) u.email = partial.email;
  // If you later split to Profile model, update there. For now, ignore displayName/bio/avatar if not in schema.

  await u.save();
  return sanitize(u);
}

export async function deleteUser(id: string) {
  const n = await User.destroy({ where: { id } });
  return n > 0;
}

export async function searchUsers(keyword: string, limit = 20) {
  const list = await User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: `%${keyword}%` } },
        { email: { [Op.iLike]: `%${keyword}%` } },
      ],
    },
    limit,
    order: [["username", "ASC"]],
    attributes: ["id", "username", "email", "createdAt"],
  });
  return list.map(sanitize);
}

/** Followers / following counts (and optional isFollowing flag relative to viewer) */
export async function getUserStats(userId: string, viewerId?: string) {
  const [followers, following, posts] = await Promise.all([
    Follow.count({ where: { followingId: userId } }),
    Follow.count({ where: { followerId: userId } }),
    Post.count({ where: { authorId: userId } }),
  ]);

  let isFollowing: boolean | undefined = undefined;
  if (viewerId) {
    const edge = await Follow.findOne({
      where: { followerId: viewerId, followingId: userId },
    });
    isFollowing = !!edge;
  }

  return { followers, following, posts, isFollowing };
}

/** Followers list (paginated) */
export async function getFollowers(userId: string, limit = 20, offset = 0) {
  const rows = await Follow.findAll({
    where: { followingId: userId },
    limit,
    offset,
    include: [
      { model: User, as: "follower", attributes: ["id", "username", "email"] },
    ],
    order: [["followerId", "ASC"]],
  });
  return rows
    .map((r) => (r.follower ? sanitize(r.follower) : null))
    .filter(Boolean);
}

/** Following list (paginated) */
export async function getFollowing(userId: string, limit = 20, offset = 0) {
  const rows = await Follow.findAll({
    where: { followerId: userId },
    limit,
    offset,
    include: [
      { model: User, as: "following", attributes: ["id", "username", "email"] },
    ],
    order: [["followingId", "ASC"]],
  });
  return rows
    .map((r) => (r.following ? sanitize(r.following) : null))
    .filter(Boolean);
}

/** never expose password */
function sanitize(u: User) {
  const plain = u.get({ plain: true }) as any;
  delete plain.password;
  return plain;
}
