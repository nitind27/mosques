import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function ViewedMe(req, res) {
  try {
    //Get email from body
    const email = req.body;

    //Check if email is valid
    if (!email || email === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      const result = await sql`
        SELECT ca.*
        FROM views v
        JOIN createAcc ca ON v.viewer_email = ca.email
        WHERE v.viewed_email = ${email}
    `;

      res.json({ data: result.rows });
    } catch (error) {
      console.log("Error while inserting into verify table", error);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error on imam/verifyEmail" });
  }
}
