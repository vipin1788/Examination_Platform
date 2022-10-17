'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserAccounts = sequelize.define('user_accounts', {
            user_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            full_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{isEmail: true},
                unique: true
            },
            mobile: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            referalcode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            state_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            city_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date()
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date()
            },
        },
        {
            timestamps: false
        });

    return UserAccounts;
};
