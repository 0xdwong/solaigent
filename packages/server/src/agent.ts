
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createRetrieverTool } from "langchain/tools/retriever";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MyLogger } from './utils/mylogger';
const logger = new MyLogger();


function getSearchTool() {
    const searchTool = new TavilySearchResults({ 'apiKey': process.env.TAVILY_API_KEY });
    return searchTool;
}

async function getRetrieverTool() {
    const embeddings = new OpenAIEmbeddings();
    const splitter = new RecursiveCharacterTextSplitter();

    const loader = new CheerioWebBaseLoader(
        "https://solana.com/docs"
    );

    const docs = await loader.load();
    const splitDocs = await splitter.splitDocuments(docs);
    const vectorstore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings
    );

    const retriever = vectorstore.asRetriever();
    const retrieverTool = createRetrieverTool(retriever, {
        name: "blockchain_search",
        description:
            "Search for information about Solana. For any questions about Solana, you must use this tool!",
    });

    return retrieverTool;
}

let agentExecutor;
async function getExecutor() {
    if (agentExecutor) return agentExecutor;

    const tools = [await getRetrieverTool(), getSearchTool()];

    const agentPrompt = await pull<ChatPromptTemplate>(
        "hwchase17/openai-functions-agent"
    );

    const agentModel = new ChatOpenAI({
        modelName: "gpt-3.5-turbo-1106",
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const agent = await createOpenAIFunctionsAgent({
        llm: agentModel,
        tools,
        prompt: agentPrompt,
        streamRunnable: true
    });

    agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: false,
    });

    return agentExecutor;
}

export function llm() {
    const agentModel = new ChatOpenAI({
        modelName: "gpt-3.5-turbo-1106",
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
    });
    return agentModel
}

export async function invoke(input: string) {
    const agentExecutor = await getExecutor();

    let output = '';
    try {
        const result = await agentExecutor.invoke({ 'input': input });
        output = result.output;
    } catch (err) {
        logger.error('agent invoke failed', err);
    }
    return output
}

export async function stream(input: string): Promise<any> {
    const agentExecutor = await getExecutor();

    const parser = new StringOutputParser();

    let output = '';
    try {
        const logStream = await agentExecutor.streamLog({ 'input': input });
        output = logStream;
    } catch (err) {
        logger.error('agent stream failed', err);
    }
    return output
}
