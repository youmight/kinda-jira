const sendResponse = (res, data, statusCode, message, success) => {
    res.json({
        message,
        statusCode,
        data,
        success
    }
    );
}

module.exports = sendResponse;