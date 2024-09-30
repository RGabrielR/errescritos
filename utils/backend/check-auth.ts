import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
export const checkAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: "credential is required" });
  }
  const token = await kv.get("token");

  const cryptedCredential = crypto
    .createHash("sha256")
    .update(credential)
    .digest("hex");
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(cryptedCredential, "hex"),
    Buffer.from(token as string, "hex")
  );

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credential" });
  }

  res.status(200).json({ success: true, message: "credential is correct" });
};

export const checkCredential = async (cryptedCredential: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN_SECRET;
  console.log("token", token);
  if (!token) {
    return false;
  }
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(cryptedCredential, "hex"),
    Buffer.from(token as string, "hex")
  );
  return isMatch;
};
