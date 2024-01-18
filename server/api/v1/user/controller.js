const db = require('../../../utils/sequelizeLoader')
const otpGenerator = require('otp-generator');
const sendResponse = require('../../../utils/generateResponse');
const sendEmail = require('../../../utils/emailSender');
const responseMessages = require('./responseMessage.json')

const signUp = async (req, res) => {
    const { name, email } = req.body;
    try {
        const otp = otpGenerator.generate(6, { specialChars: false });
        const user = {name, email, otp};
        const newUser = await db.User.create(user);
        await sendEmail(email, `${responseMessages.OTP_SENT} ${email}`, otp);
        sendResponse(res, newUser, 201, responseMessages.NON_VERIFIED_USER_CREATED, 1);
    } catch (err) {
        if(err.errors)
            err = err.errors
        sendResponse(res, err, 501, responseMessages.SOMETHING_WENT_WRONG, 0);
    }
}

module.exports = {
    signUp
};