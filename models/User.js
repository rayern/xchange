module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User",{
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING
        },
        firebase_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                notEmpty: true
            }
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true 
        },
        first_login: {
            type: DataTypes.DATE
        },
        last_login: {
            type: DataTypes.DATE
        }
    })
    return User
}