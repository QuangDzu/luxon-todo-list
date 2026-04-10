const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_APP_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Lỗi kết nối:", error);
  } else {
    console.log("Kết nối Gmail OK!");
  }
});

module.exports = transporter;
