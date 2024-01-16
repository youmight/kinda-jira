module.exports = (sequelize, DataTypes) => {
    const Otp = sequelize.define("Otp", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        otp: {
            type: DataTypes.STRING(6),
            allowNull: false
        }
    }
    );
    Otp.associate = (model) => {
        Otp.belongsTo(model.User, {foreignKey: 'userId'})
    }
    return Otp;
};
