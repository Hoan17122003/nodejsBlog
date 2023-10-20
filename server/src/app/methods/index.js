const jwt = require('jsonwebtoken');
const fs = require('fs')

// khởi tạo token
exports.generateToken = (payload, secretSignature, tokenLife) => {
    try {
        return jwt.sign(dataForAccessToken, accessTokenScret, { algorithm: 'HS256', expiresIn: accessTokenLife });
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
};

exports.decodeToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return null;
	}
};





// bắt sự kiện người dùng khi người dùng click out

// exports.clickOut = (user,flag) => {
//     if(flag === 'out') {
//         user.dele
//     }
// }
