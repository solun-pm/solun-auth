import crypto from "crypto";
import speakeasy from "speakeasy";
import toast from "react-hot-toast";
import { encrypt } from "./encryption";

export function generateToken() {
  return crypto
    .randomBytes(96)
    .toString("base64")
    .replace(/\+/g, "0")
    .replace(/\//g, "1")
    .slice(0, 64);
}

export async function generateTempToken(
  user_id: number,
  fqe: string,
  service: string,
  token: any,
  password: string,
  fast_login: boolean
) {
  try {
    // @todo -> add fast login call from userDetails and check if enabled or not / then pwd passthrough or not

    const resCheck = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/user/jwt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      }
    );
    const dataCheck = await resCheck.json();

    if (!resCheck.ok) {
      toast.error(dataCheck.message);
      return;
    }

    if (dataCheck.fqe !== fqe) {
      console.error("Invalid token, please Login again");
      toast.error("Invalid token, please Login again");
      return;
    }

    const tempToken = generateToken();
    const e2eeSecretKey = fast_login ? generateToken() : "";
    const encryptedPwd = fast_login ? encrypt(password, e2eeSecretKey) : "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/db/saveTempToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          fqe: fqe,
          token: tempToken,
          service: service,
          password: encryptedPwd,
          fast_login: fast_login,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    const redirectUrl = fast_login
      ? process.env.NEXT_PUBLIC_WEBMAIL_AUTH_DOMAIN +
        tempToken +
        "/" +
        e2eeSecretKey
      : process.env.NEXT_PUBLIC_WEBMAIL_AUTH_DOMAIN + tempToken;

    return redirectUrl;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
    return 0;
  }
}

export function generate2FASecretKey() {
  return speakeasy.generateSecret({ length: 20 }).base32;
}
