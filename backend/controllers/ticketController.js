const Ticket = require('../models/Ticket');
const Note = require('../models/Note');

// Helper to generate next Ticket ID
const generateTicketId = async () => {
  const lastTicket = await Ticket.findOne().sort({ created_at: -1 });
  if (!lastTicket) {
    return 'TKT-001';
  }
  const lastId = lastTicket.ticket_id;
  const numberPart = parseInt(lastId.split('-')[1], 10);
  const nextNumber = numberPart + 1;
  const nextId = `TKT-${nextNumber.toString().padStart(3, '0')}`;
  return nextId;
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Public
exports.createTicket = async (req, res, next) => {
  try {
    const { customer_name, customer_email, subject, description, priority } = req.body;

    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const ticket_id = await generateTicketId();

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
      priority: priority || 'Medium',
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Public
exports.getTickets = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } },
        { ticket_id: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query).select('ticket_id customer_name subject status priority created_at -_id').sort({ created_at: -1 });
    
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:ticket_id
// @access  Public
exports.getTicketById = async (req, res, next) => {
  try {
    const { ticket_id } = req.params;
    
    const ticket = await Ticket.findOne({ ticket_id }).select('-_id -__v -updated_at');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const notes = await Note.find({ ticket_id }).select('note_text created_at -_id').sort({ created_at: -1 });

    const ticketObj = ticket.toObject();
    ticketObj.notes = notes;

    res.status(200).json(ticketObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status and/or add note
// @route   PUT /api/tickets/:ticket_id
// @access  Public
exports.updateTicket = async (req, res, next) => {
  try {
    const { ticket_id } = req.params;
    const { status, priority, notes } = req.body;
    
    const ticket = await Ticket.findOne({ ticket_id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (status) {
      if (!['Open', 'In Progress', 'Closed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      ticket.status = status;
    }

    if (priority) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
      }
      ticket.priority = priority;
    }

    if (status || priority) {
      await ticket.save();
    }

    if (notes) {
      await Note.create({
        ticket_id,
        note_text: notes,
      });
    }

    res.status(200).json({
      success: true,
      updated_at: ticket.updated_at,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket stats
// @route   GET /api/tickets/stats
// @access  Public
exports.getTicketStats = async (req, res, next) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'Open' });
    const inProgress = await Ticket.countDocuments({ status: 'In Progress' });
    const closed = await Ticket.countDocuments({ status: 'Closed' });
    const highPriority = await Ticket.countDocuments({ priority: 'High' });
    
    res.status(200).json({ total, open, inProgress, closed, highPriority });
  } catch (error) {
    next(error);
  }
};
