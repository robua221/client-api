const { TicketSchema } = require("./Ticket.schema");

const insertTicket = (ticketObj) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema(ticketObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const getTickets = (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ clientId })

        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
const getTicketsById = (_id, clientId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ _id, clientId })

        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const updateClientReply = ({ _id, message, sender }) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.findOneAndUpdate(
        { _id }, //searching criteria
        {
          status: "Pending operator response",
          $push: {
            conversations: { message, sender },
          },
        }, //value that we want to update
        { new: true } //see updated value or no
      )

        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
const updateStatusClose = ({ _id,clientId }) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.findOneAndUpdate(
        { _id,clientId }, //searching criteria
        {
          status: "Closed"
           
        }, //value that we want to update
        { new: true } //see updated value or no
      )

        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertTicket,
  getTickets,
  getTicketsById,
  updateClientReply,
  updateStatusClose
};
