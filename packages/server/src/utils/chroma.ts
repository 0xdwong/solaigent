import * as dotenv from 'dotenv';
dotenv.config();
import { MyLogger } from './mylogger';
const logger = new MyLogger();
import { ChromaClient, Collection } from 'chromadb'
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

export async function addDoc2Collection(collectionName: string, url: string): Promise<string[]> {
    let collection = await client.getCollection({
        name: collectionName,
        embeddingFunction: embedder,
    });

    const docs = await createDocs(url);
    const ids = Array.from({ length: docs.length }, () => String(Math.floor(Math.random() * 100000000)));//TODO
    const metadatas = docs.map(ele => ele.metadata);
    const documents = docs.map(ele => ele.pageContent);

    await collection.add({
        ids: ids,
        metadatas: metadatas,
        documents: documents,
    });
    return ids;
}

export async function createCollection(name: string) {
    let collection = await getCollection(name);
    if (collection) return collection;

    let newCollection = await client.createCollection({
        name: name,
        embeddingFunction: embedder,
    });
    return newCollection
}

async function getCollection(name: string): Promise<Collection> {
    let collection = null;
    try {
        collection = await client.getCollection({
            name: name,
            embeddingFunction: embedder,
        });
    } catch (err) {
        // not exist
    }

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

export async function updateDoc(collectionName: string, url: string) {
    // add to vectore
    const ids = await addDoc2Collection(collectionName, url);
    return ids;
}

export async function removeDocFromCollection(collectionName: string, ids: string[]): Promise<boolean> {
    let collection = await getCollection(collectionName);
    if (!collection) return false;

    try {
        const results = await collection.delete({
            ids: ids,
        });
        logger.debug('==removeDocFromCollection==', results);
    } catch (err) {
        logger.error('====removeDocFromCollection====', err);
        return false;
    }

    return true;
}