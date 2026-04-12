import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const getTutorDataForContext = async () => {
    const tutors = await prisma.tutorProfile.findMany({
        include: {
            user: { select: { name: true } },
            category: { select: { name: true } }
        },
        take: 20 // Limiting for context window
    });

    return tutors.map(t => ({
        id: t.id,
        name: t.user.name,
        category: t.category?.name,
        subjects: t.subjects,
        hourlyRate: t.hourlyRate,
        rating: t.rating,
        bio: t.bio.substring(0, 100) + "..."
    }));
};

const chatWithAI = async (message: string, history: any[] = []) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const tutorsContext = await getTutorDataForContext();

    const systemPrompt = `You are a helpful assistant for "Skill Bridge", a tutoring platform. 
    Your goal is to help students find the best tutors for their needs.
    Here is some information about our top tutors:
    ${JSON.stringify(tutorsContext)}
    
    When suggesting tutors, mention their name, category, and hourly rate.
    Be polite and professional. If you don't know something about a tutor not in the list, just say you can't find that specific detail right now.`;

    // Ensure history is in the correct format and filter out invalid entries
    const validHistory = (history || [])
        .filter(item => 
            item && 
            (item.role === "user" || item.role === "model") && 
            item.parts && 
            item.parts.length > 0 && 
            item.parts[0].text
        )
        .map(item => ({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: String(item.parts[0].text) }]
        }));

    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I am ready to help students find the perfect tutor on Skill Bridge." }] },
            ...validHistory
        ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
};

const smartSearch = async (query: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are a search query interpreter for Skill Bridge.
    User Query: "${query}"
    
    Based on this query, extract the following filters in JSON format:
    - search (keyword for bio or subjects)
    - category (one of Math, Science, Language, Music, Art, Programming, Marketing, Design, Other)
    - maxPrice (number)
    - minRating (number)
    - location (string)
    
    If a filter is not mentioned, return null for that field.
    Only return the JSON. No other text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    try {
        // Clean the response in case Gemini adds markdown code blocks
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse AI search response:", text);
        return { search: query };
    }
};

export const AIService = {
    chatWithAI,
    smartSearch,
};
