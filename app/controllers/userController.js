const db = require('../models');
const UserType = db.UserType;
const UserAccounts = db.UserAccount;
const bcrypt = require('bcrypt')
const saltRounds = 10;
const sequelize = db.sequelize;
const Helper  = require('../util/helper')
const jwt = require("jsonwebtoken");

module.exports = {
    addUserType: (req, res, next) => {
        try {
            let data = req.body;
            UserType.create(data)
                .then(state => res.status(200).json({error: false, message: 'State created successfully', data: state}))
                .catch(err => res.status(500).json({error: true, message: err.message}));
        } catch (err) {
            res.status(500).json({error: true, message: err.message})
        }
    },

    getAllUserType: (req, res, next) => {
        try {
            let order = [['user_type_id', 'ASC']];
            let limit = req.query.limit || 10;
            let offset = req.query.offset || 0;
            UserType.findAll({order, limit, offset})
                .then(stateList => res.status(200).json({error: false, data: stateList}))
                .catch(err => res.status(500).json({error: true, message: err.message}));
        } catch (err) {
            res.status(500).json({error: true, message: err.message})
        }
    },
    addUser: async (req, res, next) => {
        try {

        const chkUser = await sequelize.query(
            `SELECT * FROM user_accounts WHERE email = ?`,
            {
                replacements: [req.body.email],
                raw: true,
                type: sequelize.QueryTypes.SELECT,
            }
        );
        if (chkUser.length) {
            return res.status(200).json({
                statusCode: 203,
                message: "Email already exists",
            });
        }

        if (req.body.user_type_id == 1) {
            if (!req.body.school_id) {
                return res.status(200).json({
                    statusCode: 203,
                    message: "Pathsala id missing",
                });
            }
            if (!(await checkSchool(school_id))) {
                return res.status(200).json({
                    statusCode: 203,
                    message: "Pathsala not exists",
                });
            }
        }
        let data = {
            full_name: req.body.name,
            email: req.body.email.toLowerCase(),
            mobile: req.body.mobile,
            password: await bcrypt.hash(req.body.password, saltRounds),
            user_type_id: req.body.user_type_id,
            state_id: req.body.state_id,
            city_id: req.body.city_id
        }

        const result = await sequelize.query(
            `INSERT INTO user_accounts (user_type_id,full_name, email,mobile, state_id, city_id, password) VALUES (?,?,?,?,?,?,?) RETURNING user_id`,
            {
                replacements: [
                    data.user_type_id,
                    data.full_name,
                    data.email,
                    data.mobile,
                    data.state_id,
                    data.city_id,
                    data.password,
                ],
                raw: true,
                type: sequelize.QueryTypes.INSERT,
            }
        );
        let lastInsertedId = result[0][0].user_id;

        const getEnrolId = await Helper.generateEnrollmentNo(
            lastInsertedId,
            data.full_name
        );
        // if user type is student then insert in student_profiles #pathshala
        if (data.user_type_id == 1) {
            await sequelize.query(
                `INSERT INTO student_profiles (user_id,enrollment_id, school_id) VALUES (?,?,?)`,
                {
                    replacements: [lastInsertedId, getEnrolId, data.school_id],
                    raw: true,
                    type: sequelize.QueryTypes.INSERT,
                }
            );

            // if student is E-gyan
        } else if (data.user_type_id == 2) {
            await sequelize.query(
                `INSERT INTO egyan_student_profiles (user_id,enrollment_id) VALUES (?,?)`,
                {
                    replacements: [lastInsertedId, getEnrolId],
                    raw: true,
                    type: sequelize.QueryTypes.INSERT,
                }
            );
            // if user is pathsala/school
        } else if (data.user_type_id == 1) {
            await sequelize.query(
                `INSERT INTO school_registration (user_id,enrollment_id) VALUES (?,?)`,
                {
                    replacements: [lastInsertedId, getEnrolId],
                    raw: true,
                    type: sequelize.QueryTypes.INSERT,
                }
            );
            // if user is educator
        } else if (data.user_type_id == 4) {
            await sequelize.query(
                `INSERT INTO educators (user_id ) VALUES (?)`,
                {
                    replacements: [lastInsertedId],
                    raw: true,
                    type: sequelize.QueryTypes.INSERT,
                }
            );
            // if user is parent
        } else if (data.user_type_id == 5) {
            // get student id by enrollment id
            const getStudent = await sequelize.query(
                `SELECT user_id FROM student_profiles WHERE enrollment_id = ?`,
                {
                    replacements: [data.enrollment_id],
                    raw: true,
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            if (!getStudent.length) {
                return res
                    .status(200)
                    .json({statusCode: 203, message: "No student find"});
            }
            await sequelize.query(
                `INSERT INTO student_parents (user_id,student_id) VALUES (?,?)`,
                {
                    replacements: [lastInsertedId, getStudent[0].user_id],
                    raw: true,
                    type: sequelize.QueryTypes.INSERT,
                }
            );
        }

        return res
            .status(200)
            .json({statusCode: 200, message: "Added", user_id: lastInsertedId});
    } catch(error) {
        console.log("-error", error);
        // delete if any child entry not working
        if (lastInsertedId != "") {
            await config.sequelize.query(
                `DELETE FROM user_accounts WHERE user_id = ?`,
                {
                    replacements: [lastInsertedId],
                    raw: true,
                    type: config.sequelize.QueryTypes.DELETE,
                }
            );
        }
        return res
            .status(200)
            .json({statusCode: 203, message: "Something went wrong"});
    }

    },

    async checkSchool(school_id) {
        const getSchool = await sequelize.query(
            `SELECT user_id FROM user_accounts WHERE user_type_id = 3 AND user_id = ?`,
            {
                replacements: [school_id],
                raw: true,
                type: sequelize.QueryTypes.SELECT,
            }
        );
        return getSchool.length ? getSchool[0].user_id : "";
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const checkUser = await sequelize.query(
                `SELECT * FROM user_accounts WHERE email = ?`,
                {
                    replacements: [email],
                    raw: true,
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (checkUser.length) {
                if (!bcrypt.compareSync(password, checkUser[0].password)) {
                    return res
                        .status(200)
                        .json({ statusCode: 203, message: "Invalid login details." });
                }
            } else {
                return res.status(200).json({
                    statusCode: 203,
                    message: "Email not match in system.",
                });
            }
            console.log("-checkUser", checkUser);
            const token =
                "Bearer" +
                " " +
                jwt.sign({ sub: checkUser[0].id }, 'shhhhh');

            // const { user, ...passwordw } = checkUser[0];
            delete checkUser[0].password;
            return res.status(200).json({
                statusCode: 200,
                message: "User logedin",
                data: checkUser[0],
                token,
            });
        } catch (error) {
            console.log("-error", error);
            return res
                .status(200)
                .json({ statusCode: 203, message: "Something went wrong" });
        }
    }
}
