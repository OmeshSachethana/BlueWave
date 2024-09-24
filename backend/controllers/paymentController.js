const Payment = require('../models/payment');  // Ensure correct path

// Create or replace a payment record if duplicate cardNumber exists
exports.createPayment = async (req, res) => {
  try {
    const { type, cardNumber, name, expiryDate, cvv } = req.body;

    // Check if a payment record with the same cardNumber exists
    let existingPayment = await Payment.findOne({ cardNumber });

    if (existingPayment) {
      // Update the existing payment record
      existingPayment.type = type;
      existingPayment.name = name;
      existingPayment.expiryDate = expiryDate;
      existingPayment.cvv = cvv;

      await existingPayment.save();
      return res.status(200).json({ message: 'Payment record updated successfully', data: existingPayment });
    } else {
      // Create a new payment document if no duplicate found
      const newPayment = new Payment({
        type,
        cardNumber,
        name,
        expiryDate,
        cvv
      });

      // Save the new payment record to the database
      await newPayment.save();
      res.status(201).json({ message: 'Payment record created successfully', data: newPayment });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating or updating payment record', error: error.message });
  }
};


// Get a payment record by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the payment record by ID
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: `No payment record found with ID ${id}` });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment record', error: error.message });
  }
};

// Get all payment records
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment records', error: error.message });
  }
};

// Update a payment record by ID
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, cardNumber, name, expiryDate, cvv } = req.body;

    // Find the payment record by ID and update it
    const updatedPayment = await Payment.findByIdAndUpdate(id, {
      type,
      cardNumber,
      name,
      expiryDate,
      cvv
    }, { new: true });  // Return the updated document

    if (!updatedPayment) {
      return res.status(404).json({ message: `No payment record found with ID ${id}` });
    }

    res.status(200).json({ message: 'Payment record updated successfully', data: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment record', error: error.message });
  }
};

// Delete a payment record by ID
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the payment record by ID and delete it
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: `No payment record found with ID ${id}` });
    }

    res.status(200).json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment record', error: error.message });
  }
};
