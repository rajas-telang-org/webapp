import fs from "fs";
import csv from "csv-parser";
import User from "./model/UserModel.js"; // Assuming your model is defined in models/user.js

const filePath = "./opt/users.csv"; // Replace with the actual path to your CSV file

const processCSVFile = async () => {
  const data = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Assuming your CSV columns match the User model attributes
      data.push({
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        password: row.password,
      });
    })
    .on("end", async () => {
      try {
        await User.bulkCreate(data);
        console.log("Data imported successfully");
      } catch (error) {
        console.error("Error importing data:");
      }
    });
};

export default processCSVFile;
