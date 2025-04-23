require('dotenv').config(); // Add dotenv to manage environment variables
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Re-add nodemailer

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit to 10MB

const clientURL = process.env.CLIENT_URL;

const cors = require('cors');
if (clientURL) {
  app.use(cors({ origin: clientURL }));
}

const RESEND_API_KEY = process.env.RESEND_API_KEY; // Use environment variable for API key

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com', // Replace with your SMTP server
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'resend', // Replace with your email
    pass: RESEND_API_KEY
  }
});

app.get('/health-check', (req, res) => {
  res.status(200).send(`Server is running! ts=${new Date().toISOString()}`);
});

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { emailAddress, chartImage } = req.body;

  if (!emailAddress || !chartImage) {
    return res.status(400).send('Invalid request data.');
  }

  // Validate email address format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    return res.status(400).send('Invalid email address.');
  }

  // Validate Base64 image format
  const base64Regex = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(chartImage)) {
    return res.status(400).send('Invalid chart image format.');
  }

  console.log('send-email Request body:', req.body);
  const subject = 'Your Chart from Ducks 2 Dare';
  const emailBody = 'Please find your chart attached.';

  try {
    const sendResult = await transporter.sendMail({
      from: '"Ducks 2 Dare" <onboarding@resend.dev>', // Updated to use Resend test/dev email
      to: emailAddress,
      subject,
      html: `<p>${emailBody}</p>`,
      attachments: [
        {
          filename: 'chart.png', // Name of the file
          content: chartImage.split(',')[1], // Base64 content of the image
          encoding: 'base64', // Specify the encoding
        },
      ],
    });

    console.log('Email sent successfully:', sendResult);

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