const express = require("express");
const { insertTicket } = require("../model/ticket/Ticket.model");

const router = express.Router();

router.all("/", (req, res, next) => {
  next();
});

router.post("/", async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    const ticketObj = {
      clientId: "618065eafb487d937efa5cd4",
      subject,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };

    const result = await insertTicket(ticketObj);
 
    if (result._id) {
      return res.json({ status: "success", message: "New ticket created" });
    }
    res.json({ status: "error", message: "Unable to create new ticket" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
