const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
  replyBody: String,
  userReplied: String,
  userId: String,
  repliedOn: { 
    type: Date, 
    default: Date.now 
  },
  replies: [this], // Nest the replySchema within itself
});

const questionSchema = mongoose.Schema({
  questionTitle: {
    type: String,
    required: "Question must have a title"
  },
  questionBody: {
    type: String,
    required: "Question must have a body"
  },
  noOfAnswers: {
    type: Number,
    default: 0
  },
  upVote: { 
    type: [String], 
    default: [] 
  },
  downVote: { 
    type: [String], 
    default: [] 
  },
  userPosted: { 
    type: String, 
    required: "Question must have an author" 
  },
  userId: { 
    type: String 
  },
  askedOn: { 
    type: Date, 
    default: Date.now 
  },
  answer: [
    {
      answerBody: String,
      userAnswered: String,
      userId: String,
      answeredOn: { 
        type: Date, 
        default: Date.now 
      },
      replies: [replySchema],
    },
  ],
  uploadedFile: {
    type: String, // Assuming you store the file URI as a string
  },
})

module.exports = mongoose.model("Question", questionSchema);