import * as dotenv from 'dotenv';
dotenv.config();
import { MyLogger } from './mylogger';
const logger = new MyLogger();
import { ChromaClient, Collection } from 'chromadb'
import { OpenAIEmbeddingFunction } from 'chromadb'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { v4 as uuidv4 } from 'uuid';


const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
});

const client = new ChromaClient();

export async function addDocs2Collection(collectionName: string, docs: Document[]): Promise<string[]> {
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);

    const ids = Array.from({ length: splitDocs.length }, () => String(uuidv4()));
    const metadatas = splitDocs.map(ele => ele.metadata);
    const documents = splitDocs.map(ele => ele.pageContent);

    try {
        let collection = await client.getCollection({
            name: collectionName,
            embeddingFunction: embedder,
        });

        await collection.add({
            ids: ids,
            metadatas: metadatas,
            documents: documents,
        });
    } catch (err) {
        logger.error('==addDocs2Collection==faield', err);
    }
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

export async function updateDoc(collectionName: string, docs: Document[]) {
    // add to vectore
    const ids = await addDocs2Collection(collectionName, docs);
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

export async function getDocument(collectionName: string, ids: string[]): Promise<string[]> {
    let collection = await getCollection(collectionName);
    if (!collection) return [];

    let documents = [];
    try {
        const result = await collection.get({
            ids: ids,
        });
        documents = result.documents
    } catch (err) {
        logger.error('====getDocument====', err);
    }

    return documents;
}