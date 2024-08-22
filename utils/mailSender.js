const nodemailer = require('nodemailer');

class MailSender {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: `Account activation on ${process.env.API_URL}`,
            text: '',
            html:
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>FastCard Account Activation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        line-height: 1.6;
                    }

                    .container {
                        width: 80%;
                        max-width: 600px;
                        margin: 30px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }

                    h1 {
                        color: #000000;
                        text-align: center;
                    }

                    p {
                        margin-bottom: 20px;
                    }

                    .activation-button {
                        display: block;
                        width: fit-content;
                        margin: 20px auto;
                        padding: 10px 20px;
                        background-color: #000000;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                        text-align: center;
                    }

                    .activation-button:hover {
                        background-color: #303030;
                    }

                    .signature {
                        margin-top: 40px;
                        font-style: italic;
                        text-align: center;
                    }

                    @media (max-width: 600px) {
                        .container {
                            width: 100%;
                            padding: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Activate Your Flaze Account</h1>
                    <p>Hello,</p>

                    <p>Thank you for joining Flaze!</p>

                    <p>Please activate your Flaze account by clicking the button below:</p>

                    <a href="${link}" class="activation-button">Activate Account</a>

                    <p>If the button doesn't work, you can also activate your account by following this link:</p>

                    <p><a href="${link}">${link}</a></p>

                    <p class="signature"><br>The Flaze Team</p>
                </div>
            </body>
            </html>

            `
        })
    }
}

module.exports = new MailSender();