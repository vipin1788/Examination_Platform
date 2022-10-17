module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define('cities', {
            city_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            city_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false
        });

    return City;
};
