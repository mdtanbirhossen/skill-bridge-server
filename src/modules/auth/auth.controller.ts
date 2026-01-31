import { Request, Response } from "express";
import { AuthService } from "./auth.service";

// Read environment variables
const FRONTEND_URL = process.env.APP_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";
const COOKIE_SECURE = NODE_ENV === "production"; // only secure in production

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const result = await AuthService.createUser(req.body);
    console.log("node env:", NODE_ENV);
    console.log("frontend url:", FRONTEND_URL);
    console.log("cookie secure:", COOKIE_SECURE);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SECURE ? "none" : "lax", // "none" needed for cross-site in prod
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: COOKIE_SECURE ? new URL(FRONTEND_URL).hostname : undefined, // only set domain in prod
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await AuthService.signInUser({ email, password });
    console.log("node env:", NODE_ENV);
    console.log("frontend url:", FRONTEND_URL);
    console.log("cookie secure:", COOKIE_SECURE);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: COOKIE_SECURE ? new URL(FRONTEND_URL).hostname : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await AuthService.getUserById(user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const AuthController = {
  register,
  login,
  getCurrentUser,
};
