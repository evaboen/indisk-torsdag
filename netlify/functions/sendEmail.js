const nodemailer = require("nodemailer");

exports.handler = async function(event, context) {
  const { to, subject, message } = JSON.parse(event.body);

  // Gmail App Password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,      // din Gmail
      pass: process.env.PASSWORD,          // app password fra Google
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject,
      text: message
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
