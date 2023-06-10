import crypto from 'crypto';
import speakeasy from 'speakeasy';

export function generateToken() {
    return crypto
        .randomBytes(96)
        .toString('base64')
        .replace(/\+/g, '0')
        .replace(/\//g, '1')
        .slice(0, 64);
}

export function generate2FASecretKey(){
    return speakeasy.generateSecret({ length: 20 }).base32;
}