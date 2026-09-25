const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  getTicketStats,
} = require('../controllers/ticketController');

router.route('/').post(createTicket).get(getTickets);
router.route('/stats').get(getTicketStats);
router.route('/:ticket_id').get(getTicketById).put(updateTicket);

module.exports = router;
