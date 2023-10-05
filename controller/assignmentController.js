import Assignment from "../model/AssignmentModel.js";
import sequelize from "../config/database.js";
import User from "../model/UserModel.js";

export const createAssignment = async (req, res) => {
  try {
    const { name, points, num_of_attempts, deadline } = req.body;
    const user_id = req.user.id;
    console.log("ndkjnvdnjvn", req.user);

    // 400 Bad Request for invalid input
    if (!name || !points || !num_of_attempts || !deadline) {
      return res
        .status(400)
        .json({ message: "Invalid input: All fields are required" });
    }

    // 401 Unauthorized if user id is not present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newAssignment = await Assignment.create({
      user_id,
      name,
      points,
      num_of_attempts,
      deadline,
    });

    res.status(201).json({
      message: "Assignment created successfully",
      data: newAssignment,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Assignment with the same name already exists." });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get all ASsignments

export const getAllAssignments = async (req, res) => {
  try {
    console.log("get alla mdasmc");
    // const user_id = req.user.id;
    const assignments = await Assignment.findAll({
      // include: [
      //   {
      //     model: User,
      //     as: "user",
      //     attributes: ["id", "first_name", "last_name", "email"],
      //   },
      // ],
    });
    if (req.body && Object.keys(req.body).length > 0) {
      return res.status(400).send();
    }
    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found" });
    }

    console.log(assignments);

    res.status(200).json({
      status: "success",
      message: "Assignments fetched successfully",
      data: assignments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update assignment

export const updateAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, points, num_of_attempts, deadline } = req.body;
    console.log(deadline);

    const authenticatedUserId = req.user.id;

    // Finding the assignment to update
    const assignment = await Assignment.findOne({ where: { id } });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.user_id !== authenticatedUserId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this assignment" });
    }

    if (!name && !points && !num_of_attempts && !deadline) {
      return res
        .status(400)
        .json({ message: "No fields to update were provided" });
    }

    let updatedFields = [];

    // Updating assignment
    if (name && assignment.name !== name) {
      assignment.name = name;
      updatedFields.push("name");
    }
    if (points && assignment.points !== points) {
      assignment.points = points;
      updatedFields.push("points");
    }
    if (num_of_attempts && assignment.num_of_attempts !== num_of_attempts) {
      assignment.num_of_attempts = num_of_attempts;
      updatedFields.push("num_of_attempts");
    }
    if (deadline && assignment.deadline !== deadline) {
      assignment.deadline = deadline;
      updatedFields.push("deadline");
    }

    // If there are no changes
    if (updatedFields.length === 0) {
      return res.status(200).json({
        message: "No update is required. No changes in the input.",
        data: assignment,
      });
    }

    await assignment.save();

    // Sending the updated assignment in the response
    res.status(200).json({
      message: "Assignment updated successfully",
      updatedFields,
      data: assignment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// delete assign

export const deleteAssignment = async (req, res) => {
  try {
    // Retrieve ID from the request parameters
    const { id } = req.params;
    const authenticatedUserId = req.user.id;

    const assignment = await Assignment.findByPk({ where: { id } });

    if (!assignment) {
      return res.status(404).json({ message: "assignment not found" });
    }

    if (assignment && assignment.user_id !== authenticatedUserId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this assignment" });
    }

    // Attempt to delete the assignment with the given ID
    const deletedRowCount = await Assignment.destroy({
      where: { id: id },
    });

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get assign by id

export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    // const user_id = req.user.id;
    console.log(id);

    const assg = await Assignment.findOne({ where: { id } });

    console.log(assg);

    if (req.body && Object.keys(req.body).length > 0) {
      return res.status(400).send();
    }

    // Check if assignment exists
    if (!assg) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assg);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
