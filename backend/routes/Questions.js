const express = require('express');
const multer = require('multer');
const { askQuestion, deleteQuestion, getAllQuestions, voteQuestion, showQuestionDetails } = require('../controllers/questionController'); 
const auth = require('../middleware/requireAuth'); 
const upload = multer();
const router = express.Router()

router.post('/askQuestion/:userId', auth, upload.single('file'), askQuestion);
router.get('/allQuestions', getAllQuestions)
router.get('/questionDetails/:questionId', auth, showQuestionDetails)
router.delete('/delete/:id', auth, deleteQuestion)
router.patch("/vote/:id", auth, voteQuestion)

module.exports = router;
