import { Router } from 'express';
import * as ctrl from '../controllers/comments.controller';

const r = Router();

r.post('/', ctrl.createComment);
r.get('/by-post/:postId', ctrl.getCommentsByPost);
r.delete('/:id', ctrl.deleteComment);

export default r;