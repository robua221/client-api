const express = require("express");
const {
  insertTicket,
  getTickets,
  getTicketsById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
} = require("../model/ticket/Ticket.model");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const router = express.Router();

router.all("/", (req, res, next) => {
  next();
});
// Create new Ticket
router.post("/", userAuthorization, async (req, res) => {
  try {
    const { subject, sender, message } = req.body;
    const userId = req.userId;

    const ticketObj = {
      clientId: userId,
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

//Get all ticket for a specific user

router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getTickets(userId);

    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//Get all ticket for a specific user

router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await getTicketsById(_id, clientId);

    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
//Update  reply message from client

router.put("/:_id", userAuthorization, async (req, res) => {
  try {
    const { message, sender } = req.body;
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await updateClientReply({ _id, message, sender });
    if (result._id) {
      return res.json({ status: "success", message: "message updated" });
    }
    return res.json({
      status: "error",
      message: "unable to update the message",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//Update ticket status to close

router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await updateStatusClose({ _id, clientId });
    if (result._id) {
      return res.json({ status: "success", message: "Ticket closed" });
    }
    return res.json({
      status: "error",
      message: "unable to update ticket",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
//Delete ticket

router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });
    console.log(result);
    return res.json({ status: "success", message: "Ticket Deleted" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
