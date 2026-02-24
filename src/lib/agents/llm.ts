import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface LLMConfig {
    temperature?: number;
    streaming?: boolean;
}

export function createBaseLLM(config?: LLMConfig): BaseChatModel {
    const provider = process.env.LLM_PROVIDER?.toLowerCase() || "groq";
    const temperature = config?.temperature ?? 0.7;

    switch (provider) {
        case "ollama":
            // Standard local Ollama doesn't use an API key, but if you're using a hosted
            // Ollama instance that requires auth, you can pass it in headers.
            const headers: Record<string, string> = {};
            if (process.env.OLLAMA_API_KEY) {
                headers["Authorization"] = `Bearer ${process.env.OLLAMA_API_KEY}`;
            }

            return new ChatOllama({
                // model: process.env.OLLAMA_MODEL || "glm-5:cloud",
                model: process.env.OLLAMA_MODEL || "gpt-oss:120b-cloud",
                baseUrl: process.env.OLLAMA_BASE_URL || "https://ollama.com",
                temperature,
                headers: Object.keys(headers).length > 0 ? headers : undefined,
                ...config,
            }) as unknown as BaseChatModel;

        case "groq":
        default:
            return new ChatGroq({
                apiKey: process.env.GROQ_API_KEY,
                model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
                temperature,
                streaming: config?.streaming,
            }) as unknown as BaseChatModel;
    }
}
