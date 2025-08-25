// src/api/routes/users.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/users.controller';

const r = Router();

// CRUD
r.post('/', ctrl.create);
r.get('/id/:id', ctrl.getById);
r.get('/u/:username', ctrl.getByUsername);
r.patch('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

// discovery
r.get('/search', ctrl.search);

// social stats / lists
r.get('/:id/stats', ctrl.stats);
r.get('/:id/followers', ctrl.followers);
r.get('/:id/following', ctrl.following);

export default r;