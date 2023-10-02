export default (sequelize, DataTypes) => {
    const Log = sequelize.define("logs",{
        api_endpoint: {
            type: DataTypes.STRING
        },
        ip_address: {
            type: DataTypes.STRING
        },
        request: {
            type: DataTypes.TEXT
        },
        message: {
            type: DataTypes.TEXT
        },
        details: {
            type: DataTypes.TEXT,
        },
    },{
        underscored: true
    })
    return Log
}

