const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBookingConfirmation = async (userEmail, eventTitle, bookingId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Confirmation',
    text: `Your booking for ${eventTitle} has been confirmed. Booking ID: ${bookingId}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation };
