import * as dotenv from 'dotenv';
dotenv.config();
import { ChromaClient } from 'chromadb'
import { OpenAIEmbeddingFunction } from 'chromadb'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";


const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
});

const client = new ChromaClient();

async function createDocs(url: string) {
    const splitter = new RecursiveCharacterTextSplitter();

    const loader = new CheerioWebBaseLoader(url);

    const docs = await loader.load();

    const splitDocs = await splitter.splitDocuments(docs);
    // console.log('===splitDocs===', splitDocs);
    return splitDocs;
}

async function addDoctoCollection(collectionName: string, url: string) {
    let collection = await client.getCollection({
        name: collectionName,
        embeddingFunction: embedder,
    });

    const docs = await createDocs(url);
    const ids = Array.from({ length: docs.length }, () => String(Math.floor(Math.random() * 100000000)));
    const metadatas = docs.map(ele => ele.metadata);
    const documents = docs.map(ele => ele.pageContent);

    await collection.add({
        ids: ids,
        metadatas: metadatas,
        documents: documents,
    });
}

async function createCollection(name: string) {
    const collection = await client.createCollection({
        name: name,
        embeddingFunction: embedder,
    });
    return collection
}

async function getCollection(name: string) {
    let collection = await client.getCollection({
        name: name,
        embeddingFunction: embedder,
    });
    return collection;
}

async function query(name: string, query: string[]) {
    const collection = await getCollection(name)

    const results = await collection.query({
        nResults: 2,
        queryTexts: query,
    });
    return results;
}

async function main() {
    const collectionName = 'my_collection4';
    const url = 'https://www.helius.dev/blog/solana-mev-an-introduction';

    await createCollection(collectionName);

    await addDoctoCollection(collectionName, url);

    const results = await query(collectionName, ["bome"])
    console.log('==results==', results)
}

main()