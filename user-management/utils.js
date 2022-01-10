function generateToken(email, password) {
    let token = '';
    for (let i = 0; i < email.length; i++) {
        token += email.charAt(i);
        token += password.charAt(i);
    }
    return token;
}

function logRequest(method, uri, data, received) {
    console.log(`[User Management] ${method} ${uri}`);

    if (received === true) {
        process.stdout.write('⤶ ');
    } else if (received === false) {
        process.stdout.write('⤷ ');
    }

    if (data) {
        console.log(data);
    }
}

module.exports = {
    generateToken,
    logRequest
}

