const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Re-add nodemailer

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit to 10MB

const clientURL = 'http://localhost:52330' // Replace with your client URL

const cors = require('cors');
app.use(cors({ origin: clientURL }));

const RESEND_API_KEY = 'YOUR-API-KEY'; // Replace with your Resend API key

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