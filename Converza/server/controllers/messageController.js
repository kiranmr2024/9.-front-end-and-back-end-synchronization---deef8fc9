const Messages = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      timestamp: new Date(),
    });
    if (data) return res.json({ msg: "Message added successfully.", message: data });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        timestamp: msg.timestamp,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};