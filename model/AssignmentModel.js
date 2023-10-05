import  {DataTypes}  from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";

    const Assignment = sequelize.define('Assignment', {
    // Model attributes are defined here
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    user_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    num_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 100
        }
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    assignment_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    assignment_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, 
    }},{

        timestamps: false,
    }
);

Assignment.associate = (models) => {
  Assignment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};


export default Assignment;