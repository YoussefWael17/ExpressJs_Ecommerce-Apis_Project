import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(user: { id: string; role: string; }) {
    const options: SignOptions = {
        expiresIn: "7d",
    };

    return jwt.sign(
        {userId: user.id, role: user.role,},
        JWT_SECRET, options);
}


export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}