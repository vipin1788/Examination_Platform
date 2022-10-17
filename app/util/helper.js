const moment = require("moment");

module.exports = {
    async  generateEnrollmentNo(user_id, full_name) {
        let enrolmentID = full_name.substr(0, 3);
        enrolmentID += moment().format("DDMMYY");
        enrolmentID += user_id;
    }
}
