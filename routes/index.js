const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//     user: 'maximilian.blanda6@ethereal.email',
//     pass: 'yfNNURpX84Z7pGmg3f'
//   }
// });

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

let doctorsList = [];

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    for (const doctor of doctorsList) {
      const file = files[0];

      const htmlContent = `
      
     <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            /* Global styles */
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              max-width: 600px;
              margin: 0 auto;
            }
            .container {
              box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
              padding: 20px;
              margin: auto;
            }
            .heading {
              text-align: center;
              color: #454545;
              font-size: 22px;
              font-weight: bold;
            }
            .text-center {
              text-align: center;
            }
            .text-gray {
              color: #454545;
            }
            .text-22 {
              font-size: 22px;
            }
            .font-bold {
              font-weight: bold;
            }
            .flex {
              display: flex;
            }
            .justify-center {
              justify-content: center;
            }
            .mb-30 {
              margin-bottom: 30px;
            }
            .mt-31 {
              margin-top: 31px;
            }
            .my-31 {
              margin-top: 31px;
              margin-bottom: 31px;
            }
            .p-8-14 {
              padding: 8px 14px;
            }
            .bg-blue {
              background-color: #F48127;
              color: #000;
              margin-bottom: 20px;
            }
            .text-white {
              color: #fff;
            }
            .rounded-20 {
              border-radius: 20px;
            }
            .border-t-919 {
              border-top: 1px solid #919191;
            }
            .mt-30 {
              margin-top: 30px;
            }
            .mb-17 {
              margin-bottom: 17px;
            }
            .text-17 {
              font-size: 17px;
            }
            .text-13 {
              font-size: 13px;
            }
            .text-blue {
              color: #1473e6;
            }
            .underline {
              text-decoration: underline;
            }
            .list-disc {
              list-style: none;
              text-align: center;
            }
            .ml-15 {
              margin-left: 15px;
            }
            .border-0 {
              border: 0;
            }
            .link-data {
              color: #212121;
            }
            .btn {
              background-color: #F48127;
              color: #fff;
              min-width: 72px;
              border: 0;
              padding: 8px 14px;
              border-radius: 20px;
              margin-bottom: 20px;
            }
            .center-text {
              text-align: center;
              color: #454545;
              font-size: 17px;
            }
            .list-item {
              margin-left: 15px;
              color: #454545;
              font-size: 17px;
            }
            .link {
              color: #1473e6;
              text-decoration: underline;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div>
              <p class="text-center text-gray text-22">
                All parties finished
              </p>
              <h3 class="heading">
                Bhavin Sen NDA - Techlances
              </h3>
              <center>
                <a href="http://localhost:5000/uploads/${encodeURIComponent(file.filename)}" class="btn">
                  Open PDF File
                </a>
              </center>
              <hr class="border-t-919">
              <center class="mt-30 mb-17 text-gray text-17">
                Attached is the final agreement between:
              </center>
              <center>
                <ul class="list-disc">
                  <li class="list-item">${doctor}</li>
                </ul>
              </center>
              <div class="mt-30">
                <center class="center-text link-data">
                  <span class="text-13">Read it with</span>
                  <a href="#" class="link text-13">Acrobat Reader</a>
                  You can also
                  <a href="#" class="link text-16">open it online</a>
                  to review its activity history.
                </center>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: doctor,
        subject: "Files for Review",
        html: htmlContent,
        attachments: files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      };

      await transporter.sendMail(mailOptions);
    }

    // files.forEach((file) => {
    //   fs.unlinkSync(file.path);
    // });
    doctorsList = [];

    res.redirect("/");
  } catch (error) {
    console.error("Error uploading files:", error);
    res.redirect("/");
  }
});

router.post("/add-doctor", (req, res) => {
  const { doctor } = req.body;
  doctorsList.push(doctor);
  res.redirect("/");
});

module.exports = router;
