import { listMessages, createMessage } from '../services/messagesService.js';

export function getMessages(req, res, next) {
  try {
    const { channelId } = req.query;
    if (!channelId) return res.status(400).json({ success:false, error:{ code:'VALIDATION_ERROR', message:'channelId required' }});
    const data = listMessages(channelId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export function postMessage(req, res, next) {
  try {
    const { channelId, content } = req.body || {};
    if (!channelId || !content || typeof content !== 'string') {
      return res.status(400).json({ success:false, error:{ code:'VALIDATION_ERROR', message:'channelId and content required' }});
    }
    const msg = createMessage({ channelId, content });
    res.status(201).json({ success:true, data: msg });
  } catch (err) { next(err); }
}
