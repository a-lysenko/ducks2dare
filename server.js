const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit to 10MB

const clientURL = 'http://localhost:52330' // 'http://localhost:3000'; // Replace with your client URL

const cors = require('cors');
app.use(cors({ origin: clientURL }));

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP server
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'your-email@example.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password
  },
});

app.get('/health-check', (req, res) => {
  res.status(200).send(`Server is running! ts=${new Date().toISOString()}`);
});

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  // const { to, subject, body, chartImage } = req.body;

  console.log('Request body:', req.body);

  return res.status(200).send('Email sent successfully!');

  try {
    await transporter.sendMail({
      from: '"Ducks 2 Dare" <your-email@example.com>', // Replace with your email
      to,
      subject,
      html: `<p>${body}</p><img src="${chartImage}" alt="Chart Image" />`,
    });

    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});