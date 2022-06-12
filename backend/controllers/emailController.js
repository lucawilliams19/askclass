const asyncHandler = require('express-async-handler')
const cors = require('cors')
const Email = require('../models/emailModel')
const nodemailer = require('nodemailer')

//@desc Send email
//@route Post /api/emails/
//@access Private

const sendEmail =
	(cors(),
	async (req, res) => {
		const transport = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASSWORD,
			},
		})
	
		const file = req.body.file
		await transport
			.sendMail({
				from: process.env.MAIL_FROM,
				to: req.body.email,
				subject: 'Zoomalytics report',
				html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>Here is your analytics!</h2>
        
        <p>Best, askClass</p>
								<p> To learn more about products that can help you increase your engagement visit us at <a>Zoomalytics</a></p>
         </div>
    `,
				attachments: [
					{
						filename: file.filename,
						content: file.content,
						contentType: file.contentType,
					},
				],
				envelope: {
					from: process.env.MAIL_FROM,
					to: req.body.email,
				},
			})
			.then(() => {
				res.status(200).json({ message: 'Email sent' })
			})
			.catch((err) => {
				res.status(400).json({ message: err })
			})
	})

module.exports = { sendEmail }
