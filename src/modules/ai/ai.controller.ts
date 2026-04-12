import { Request, Response } from "express";
import { AIService } from "./ai.service";

const chat = async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res
                .status(400)
                .json({ success: false, message: "Message is required" });
        }
        console.log("message from chat controller", message);
        const reply = await AIService.chatWithAI(message, history);
        console.log("reply from chat controller", reply);
        res.status(200).json({ success: true, data: reply });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const suggest = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res
                .status(400)
                .json({ success: false, message: "Query is required" });
        }
        const filters = await AIService.smartSearch(query);
        res.status(200).json({ success: true, data: filters });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const AIController = {
    chat,
    suggest,
};
