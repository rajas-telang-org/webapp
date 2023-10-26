#!/usr/bin/node
import express from "express";
import sequelize from "./config/database.js";

import User from "./model/UserModel.js";

import Assignment from "./model/AssignmentModel.js";

import processCSVFile from "./dataImport.js";
import router from "./Routes/route.js";

// import dotenv from "dotenv";
// dotenv.config();
// console.log(process.env);
const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/healthz", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log(req.body);
    if (req.body && Object.keys(req.body).length > 0) {
      res.status(400).send("Bad Request");
    } else {
      res
        .setHeader("Cache-Control", "no-cache")
        .status(200)
        .json({ status: "Success" });
    }
  } catch (error) {
    res.setHeader("Cache-Control", "no-cache").status(503).send();
  }
});

app.use("/v1", router);
try {
  await sequelize.sync({
    alter: true,
    dialectOptions: {
      createDatabase: true,
    },
  });
  console.log("Database sync completed successfully.");
} catch (error) {
  console.error("Error while syncing database:\n", error);
}
processCSVFile();

sequelize.sync().then(() => {
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Application Running at http://localhost:${PORT}`);
  });
});

export default app;
