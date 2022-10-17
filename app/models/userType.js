module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define('user_types', {
            user_type_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_type_name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            timestamps: false
        });

    return UserType;
};
