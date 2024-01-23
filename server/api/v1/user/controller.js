const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const db = require('../../../utils/sequelizeLoader')
const sendResponse = require('../../../utils/generateResponse');
const sendEmail = require('../../../utils/emailSender');
const responseMessages = require('./responseMessage.json')

const sendOtp = async (email) => {
    const otp = otpGenerator.generate(6, { specialChars: false });
    await sendEmail(email, `${responseMessages.OTP_SENT} ${email}`, otp);
    return otp;
}

const signUp = async (req, res) => {
    const { name, email } = req.body;
    try {
        const otp = await sendOtp(email);
        const user = { name, email, otp: await bcrypt.hash(otp, 12) };
        await db.User.create(user);
        sendResponse(res, { name: user.name, email: user.email }, 201, responseMessages.USER_CREATED, 1);
    } catch (err) {
        console.log(err);
        if (err.errors)
            err = err.errors;
        else err = err.message;
        sendResponse(res, err, 501, responseMessages.SOMETHING_WENT_WRONG, 0);
    }
}

const login = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.User.findOne({ where: { email } });
        if (user) {
            const otp = await sendOtp(email);
            const data = { otp: await bcrypt.hash(otp, 12) };
            await db.User.update(data, { where: { email } })
            sendResponse(res, '', 201, `${responseMessages.OTP_SENT} ${email}`, 1);
        } else {
            throw new Error("User not found");
        }
    } catch (err) {
        console.log(err);
        if (err.errors)
            err = err.errors;
        else err = err.message;
        sendResponse(res, err, 401, `${responseMessages.SOMETHING_WENT_WRONG}`, 0);
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if(otp === ''){
            throw new Error("OTP cannot be empty");
        }
        const user = await db.User.findOne({ where: { email } });
        if (user) {
            if (await bcrypt.compare(otp, user.dataValues.otp)) {
                const token = jwt.sign(email, process.env.AUTH_SECRET);
                const newOtp = '';
                await db.User.update({otp: newOtp, isVerified: true}, { where: { email } })
                sendResponse(res, { token }, 201, responseMessages.LOGIN_SUCCESSFUL, 1);
            }
            else {
                sendResponse(res, '', 401, responseMessages.INVALID_OTP, 0);
            }
        } else {
            throw new Error("User not found");
        }
    } catch (err) {
        console.log(err);
        if (err.errors)
            err = err.errors;
        else err = err.message;
        sendResponse(res, err, 401, `${responseMessages.SOMETHING_WENT_WRONG}`, 0);
    }
}

module.exports = {
    signUp,
    login,
    verifyOtp
};