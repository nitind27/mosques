import { sql } from "@vercel/postgres";
import axios from "axios";

const dotenv = require("dotenv");
dotenv.config();

export default async function AwaitingUserGET(req, res) {
  try {
    console.log("function start");
    //Get email from body
    const email1 = req.body;

    //Check if email is valid
    if (!email1 || email1 === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      console.log("Retrievieng");

      //Getting the current imam's mosque names
      const imamMosque = await sql`SELECT type
        FROM mosques
        WHERE email = ${email1};`;

        const checkEmail4 = await sql`
        SELECT 
            createAcc.*, 
            CONCAT('[', STRING_AGG(CONCAT('[', mosques.latitude, ',', mosques.longitude, ',\"', mosques.type, '\"]'), ','), ']') AS locations, 
            ARRAY_AGG(mosques.type) AS types
        FROM 
            heart h
        JOIN 
            createAcc ON h.hearted_email = createAcc.email
        LEFT JOIN 
            mosques ON createAcc.email = mosques.email
        WHERE 
            h.hearter_email = ${email1}
        GROUP BY 
            createAcc.email;
    `;
    
      const uniqueEmails = new Set();

      // Filtering users in the same mosque as the imam and removing duplicates based on email
      const uniqueFilteredUsers = checkEmail4.rows.filter((user) => {
        if (!uniqueEmails.has(user.email)) {
          uniqueEmails.add(user.email);
          return true;
        }
        return false;
      });

      res.json({ user: uniqueFilteredUsers });

      if (checkEmail4.rows.length === 0) {
        return res.status(400).json({ error: "Email is not verified" });
      }
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
