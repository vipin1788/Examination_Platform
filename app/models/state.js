module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('states', {
        state_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        state_name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            timestamps: false
        });

    return State;
};
