import express from "express";
import basicAuth from "../Authentication/basicAuth.js";
import * as assignmentController from "../controller/assignmentController.js";
// const assignmentController = require('../controller/assignmentController.js');

const router = express.Router();

router.route("/assignments").get(assignmentController.getAllAssignments);
router
  .route("/assignments")
  .post(basicAuth, assignmentController.createAssignment);
router.route("/assignments/:id").get(assignmentController.getAssignmentById);
router
  .route("/assignments/:id")
  .delete(basicAuth, assignmentController.deleteAssignment);
router
  .route("/assignments/:id")
  .put(basicAuth, assignmentController.updateAssignmentById);

router.use((req, res) => {
  res.status(405).send("hi");
});

export default router;
