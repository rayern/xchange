export default (sequelize, DataTypes) => {
    const Role = sequelize.define("roles",{
        name: {
            type: DataTypes.STRING,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true 
        },
    },
    {
        underscored: true
    })
    return Role
}
