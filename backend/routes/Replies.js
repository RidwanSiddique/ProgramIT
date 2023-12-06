const express = require('express');
const { addReplyToAnswer, addReplyToReply, deleteReply } = require('../controllers/replyController');
const auth = require('../middleware/requireAuth');

const router = express.Router();

// Add a reply to an answer
router.post('/reply/:questionId/answer/:answerId', auth, addReplyToAnswer);

// Add a reply to a reply
router.post('/reply/:questionId/answer/:answerId/reply/:replyId', auth, addReplyToReply);

// Delete a reply
router.delete('/reply/:questionId/answer/:answerId/reply/:replyId', auth, deleteReply);

module.exports = router;