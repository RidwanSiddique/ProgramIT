require('dotenv').config();
const Questions = require("../models/questionModels");
const mongoose = require("mongoose");

const askQuestion = async (req, res) => {
  try {
    
    const { userId } = req.params;
    const { questionTitle, questionBody } = req.body;
    const uploadedFile = req.file ? req.file.path : '';
    console.log(userId)
    const question = new Questions({
      questionTitle,
      questionBody,
      uploadedFile,
      userPosted: userId,
    });

    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error posting question:', error);
    res.status(500).json({ error: 'Failed to post question' });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find().sort({ askedOn: -1 });
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    await Questions.findByIdAndRemove(_id);
    res.status(200).json({ message: "Question successfully deleted..."});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const showQuestionDetails = async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.user._id;
  const { answerBody } = req.body;

  try {
    // Find the question with the specified ID and user ID
    const question = await Questions.findOne({ _id: questionId, userId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found for the logged-in user",
      });
    }

    // Create a new answer
    const answer = {
      answerBody,
      userAnswered: userId,
      userId,
      answeredOn: Date.now(),
      replies: [],
    };

    // Add the new answer to the question's answer array
    question.answer.push(answer);

    // Save the updated question
    await question.save();

    res.status(200).json({
      success: true,
      message: "Answer added successfully",
      question,
    });
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);
    /*
    When a user votes on a question, the function checks if the user has already upvoted or downvoted the question by checking if their userId is in the respective array. If the user has already voted in the opposite way (e.g. they previously downvoted but now want to upvote), their userId is removed from the opposite array. If the user has not already voted in the same way (e.g. they have not already upvoted and now want to upvote), their userId is added to the respective array. If the user has already voted in the same way, their userId is removed from the respective array, effectively canceling their previous vote.
    */
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "Voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "Id not found" });
  }
};

module.exports={
  getAllQuestions,
  askQuestion,
  deleteQuestion,
  voteQuestion,
  showQuestionDetails,
}