import { nanoid } from 'nanoid';

export function requestId(req, res, next) {
  const existing = req.headers['x-request-id'];
  const id = existing || nanoid();
  req.id = id; // attach
  res.setHeader('x-request-id', id);
  next();
}
