

import nodemailer from 'nodemailer';

let JsonRpcProvider;

import('@mysten/sui.js').then((module) => {
    JsonRpcProvider = module.JsonRpcProvider;
    // Additional code that depends on JsonRpcProvider goes here
  
const provider = new JsonRpcProvider('wss://fullnode.sui.io'); // Use the appropriate WebSocket endpoint

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Utility function to send email
const sendEmail = async (subject, text) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'dashbuis@gmail.com',
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Subscription to Sui events
const subscribeToEvents = async () => {
  const filter = { packageId: "<PACKAGE_ID>", transactionModule: "<MODULE_NAME>", type: "<METHOD_NAME>" }; // Adjust this filter as per the event you're interested in
  let unsubscribe = await provider.subscribeEvent({
    filter: filter,
    onMessage: (event) => {
      console.log("Event detected:", JSON.stringify(event, null, 2));
      sendEmail("Sui Event Notification", `An event was detected: ${JSON.stringify(event, null, 2)}`);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Unsubscribing and exiting...');
    await unsubscribe();
    process.exit(0);
  });
};

subscribeToEvents().catch(console.error);

}).catch(console.error);
