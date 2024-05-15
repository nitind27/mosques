import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To Send Message
export default async function SendMessage(req, res) {
  try {
    console.log("Message Content: ", req.body);
    const content = req.body;

    console.log("content: ", content);
    if (!content) {
      console.log("content empty");
      res
        .status(400)
        .json({ error: "Content cannot be empty on send message." });
      return;
    }
    const senderEmail = content.senderEmail;
    const reportedEmail = content.receiverEmail;
    const messageText = content.messageText;

    const result = await sql`
    INSERT INTO reports (sender_email, reported_email, message_text, timestamp)
    VALUES (${senderEmail}, ${reportedEmail}, ${messageText}, CURRENT_TIMESTAMP);
  `;
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
