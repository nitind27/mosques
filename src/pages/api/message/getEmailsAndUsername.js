import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to retrieve email address by username
export default async function GetInfoAcc(req, res) {
  try {
    const user = req.body;

    if (!user) {
      console.log("content empty no email on getUsername.js");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const result = await sql`
    SELECT sender_email, receiver_email
    FROM messages
    WHERE sender_email = ${user} OR receiver_email = ${user};
`;
    const uniqueEmails = [];

    result.rows.forEach((row) => {
      if (
        row.sender_email !== user &&
        !uniqueEmails.includes(row.sender_email)
      ) {
        uniqueEmails.push(row.sender_email);
      }
      if (
        row.receiver_email !== user &&
        !uniqueEmails.includes(row.receiver_email)
      ) {
        uniqueEmails.push(row.receiver_email);
      }
    });

    const emailUsernamePairs = [];

    for (const email of uniqueEmails) {
      // Execute SQL query to retrieve username for each email
      const userInfo = await sql`
            SELECT username
            FROM createAcc
            WHERE email = ${email};
        `;

      // Extract username from query result
      const username = userInfo.rows[0].username; // Assuming there's only one username per email

      // Push email-username pair into emailUsernamePairs array
      emailUsernamePairs.push({ email, username });
    }

    if (result.error) {
      console.log("Database Error:", result.error);
      return { error: "Database error" };
    }

    res.json(emailUsernamePairs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
