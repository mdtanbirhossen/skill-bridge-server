import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        isBanned: boolean;
      };
    }
  }
}

interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  isBanned: boolean;
}

export const auth = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.cookies?.token as string | undefined;

      if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No token provided",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded === "string") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token payload",
        });
      }

      const payload = decoded as TokenPayload;

      if (!payload.id || !payload.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token structure",
        });
      }

      req.user = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        isBanned: payload.isBanned,
      };
      console.log(req.user)

      // Role guard
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      next();
    } catch {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }
  };
};
