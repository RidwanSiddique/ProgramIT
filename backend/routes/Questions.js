const express = require('express');

const { askQuestion, deleteQuestion, getAllQuestions, voteQuestion } = require('../controllers/questionController'); 
const auth = require('../middleware/requireAuth'); 

const router = express.Router()

router.post('/Ask', auth, askQuestion)
router.get('/All', getAllQuestions)
router.delete('/delete/:id', auth, deleteQuestion)
router.patch("/vote/:id", auth, voteQuestion);

module.exports = router;
