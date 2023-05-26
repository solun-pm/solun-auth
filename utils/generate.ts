import crypto from 'crypto';

function generateToken() {
    return crypto
        .randomBytes(96)
        .toString('base64')
        .replace(/\+/g, '0')
        .replace(/\//g, '1')
        .slice(0, 64);
}

export { generateToken };