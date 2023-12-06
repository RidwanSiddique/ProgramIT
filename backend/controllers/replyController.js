const Questions = require("../models/questionModels");
const mongoose = require("mongoose");

const addReplyToAnswer = async (req, res) => {
    const { questionId, answerId } = req.params;
    const { replyBody, userReplied, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(404).send("Question or answer unavailable...");
    }

    try {
    const question = await Questions.findById(questionId);
    const answer = question.answer.id(answerId);

    if (!answer) {
        return res.status(404).send("Answer unavailable...");
    }

    const newReply = {
        replyBody,
        userReplied,
        userId,
        repliedOn: new Date()
    };

    answer.replies.push(newReply);

    await question.save();
    res.status(200).json(question);
    } catch (error) {
    res.status(400).json("Error while adding reply");
    }
};

const addReplyToReply = async (req, res) => {
    const { questionId, answerId, replyId } = req.params;
    const { replyBody, userReplied, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId) || !mongoose.Types.ObjectId.isValid(replyId)) {
    return res.status(404).send("Question, answer, or reply unavailable...");
    }

    try {
    const question = await Questions.findById(questionId);
    const answer = question.answer.id(answerId);

    if (!answer) {
        return res.status(404).send("Answer unavailable...");
    }

    const reply = answer.replies.id(replyId);

    if (!reply) {
        return res.status(404).send("Reply unavailable...");
    }

    const newReply = {
        replyBody,
        userReplied,
        userId,
        repliedOn: new Date()
    };

    reply.replies.push(newReply);

    await question.save();
    res.status(200).json(question);
    } catch (error) {
    res.status(400).json("Error while adding reply");
    }
};

const deleteReply = async (req, res) => {
    const { questionId, answerId, replyId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId) || !mongoose.Types.ObjectId.isValid(replyId)) {
    return res.status(404).send("Question, answer, or reply unavailable...");
    }

    try {
    const question = await Questions.findById(questionId);
    const answer = question.answer.id(answerId);

    if (!answer) {
        return res.status(404).send("Answer unavailable...");
    }

    const reply = answer.replies.id(replyId);

    if (!reply) {
        return res.status(404).send("Reply unavailable...");
    }

    if (reply.userId !== userId) {
        return res.status(403).send("You are not authorized to delete this reply...");
    }

    reply.remove();

    await question.save();
    res.status(200).json(question);
    } catch (error) {
    res.status(400).json("Error while deleting reply");
    }
};

module.exports = {
    addReplyToAnswer,
    addReplyToReply,
    deleteReply
};