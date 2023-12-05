const express = require('express');

const { deleteAnswer, postAnswer }= require('../controllers/answerController'); 
const auth = require('../middleware/requireAuth'); 

const router = express.Router();

router.patch('/post/:id', auth, postAnswer);
router.patch('/delete/:id', auth, deleteAnswer);


module.exports = router;