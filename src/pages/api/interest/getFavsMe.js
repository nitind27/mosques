import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function HeartedMe(req, res) {
  try {
    console.log("HeartedMe CALELEDASDSAAS");
    //Get email from body
    const email = req.body;

    //Check if email is valid
    if (!email || email === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      //Get all the emails that have hearted the user
      const getData = await sql`
      SELECT ca.*, 
             CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations, 
             ARRAY_AGG(m.type) AS types
      FROM createAcc ca
      JOIN mosques m ON ca.email = m.email
      WHERE ca.email IN (
          SELECT DISTINCT hearter_email
          FROM heart
          WHERE hearted_email = ${email}
      )
      GROUP BY ca.email;
  `;
  
      const getEmails = getData.rows.map((row) => row.email);

      console.log("HeartedMe FASFGAPOISDNH", getEmails);

      res.json({ data: getData.rows, emails: getEmails });
    } catch (error) {
      console.log("Error on getFavsme", error);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error on imam/verifyEmail" });
  }
}
