const crypto = require("crypto");

const generateToken = (length: number) =>
{
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    const token = String(crypto.randomInt(min, max));
    
    return token;
};

export default generateToken;