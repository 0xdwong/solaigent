import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { getVectorStroe } from "./vectorstore";
import { v4 as uuidv4 } from 'uuid';
import { MyLogger } from './utils/mylogger';
const logger = new MyLogger();


function getSearchTool() {
    const searchTool = new TavilySearchResults({ 'apiKey': process.env.TAVILY_API_KEY });
    return searchTool;
}

async function getRetrieverTool() {
    const vectorstore = await getVectorStroe();
    const retriever = vectorstore.asRetriever();
    const retrieverTool = createRetrieverTool(retriever, {
        name: "blockchain_search",
        description:
            "Search for information about solana. For any questions about solana, you must use this tool!",
    });

    return retrieverTool;
}

export class MyAgent {
    private executor: any;

    constructor() { }

    async getExecutor(): Promise<any> {
        if (this.executor) {
            return this.executor;
        }

        const retriever = await getRetrieverTool()
        const tools = [getSearchTool(), retriever];

        const agentPrompt = await pull<ChatPromptTemplate>(
            "hwchase17/openai-functions-agent"
        );//TODO

        const agent = await createOpenAIFunctionsAgent({
            llm: this._getModel(),
            tools,
            prompt: agentPrompt,
            streamRunnable: true
        });

        let agentExecutor = new AgentExecutor({
            agent,
            tools,
            verbose: false,
        });

        const messageHistory = new ChatMessageHistory();
        const agentWithChatHistory = new RunnableWithMessageHistory({
            runnable: agentExecutor,
            getMessageHistory: (_sessionId) => messageHistory,
            inputMessagesKey: "input",
            historyMessagesKey: "chat_history",
        });

        this.executor = agentWithChatHistory;
        return agentWithChatHistory;
    }

    async invoke(input: string, chatId?: string): Promise<string> {
        if (!chatId) chatId = uuidv4();
        let executor = await this.getExecutor();
        let output = '';
        try {
            const result = await executor.invoke({
                'input': input,
            },
                {
                    configurable: {
                        sessionId: chatId,
                    },
                });
            output = result.output;
        } catch (err) {
            logger.error('agent invoke failed', err);
        }
        return output
    }

    async stream(input: string, chatId?: string): Promise<any> {
        if (!chatId) chatId = uuidv4();
        let executor = await this.getExecutor();
        let output = '';
        try {
            const logStream = executor.streamLog({
                'input': input,
            },
                {
                    configurable: {
                        sessionId: chatId,
                    },
                });
            output = logStream;
        } catch (err) {
            logger.error('agent stream failed', err);
        }
        return output
    }

    _getModel() {
        const agentModel = new ChatOpenAI({
            modelName: "gpt-3.5-turbo-1106",
            temperature: 0,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        return agentModel
    }
}