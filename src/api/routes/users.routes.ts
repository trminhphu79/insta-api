import { Router } from "express";
import * as ctrl from "../controllers/users.controller";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management & discovery
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user (registration endpoint)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateUserDto' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       409:
 *         description: Username or email already exists
 */
r.post("/register", ctrl.create);

r.post("/login", ctrl.login);

/**
 * @swagger
 * /users/id/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Not found
 */
r.get("/id/:id", ctrl.getById);

/**
 * @swagger
 * /users/u/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Not found
 */
r.get("/u/:username", ctrl.getByUsername);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUserDto' }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
r.patch("/:id", ctrl.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
r.delete("/:id", ctrl.remove);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by username/email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         required: false
 *         schema: { type: integer, default: 20, maximum: 50 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */
r.get("/search", ctrl.search);

/**
 * @swagger
 * /users/{id}/stats:
 *   get:
 *     summary: Get follower/following/post counts
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: viewerId
 *         required: false
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers: { type: integer }
 *                 following: { type: integer }
 *                 posts: { type: integer }
 *                 isFollowing: { type: boolean, nullable: true }
 */
r.get("/:id/stats", ctrl.stats);

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     summary: List followers
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/:id/followers", ctrl.followers);

/**
 * @swagger
 * /users/{id}/following:
 *   get:
 *     summary: List following
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/:id/following", ctrl.following);

export default r;
