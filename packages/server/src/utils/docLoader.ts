import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { loadDocument } from "./webLoader";
import { MyLogger } from './mylogger';
const logger = new MyLogger();

export async function loadDocumentByGithub(url: string): Promise<Document[]> {
    const loader = new GithubRepoLoader(url, {
        // branch: "main", //TODO:
        accessToken: process.env.GITHUB_ACCESS_TOKEN,
        recursive: true,
        unknown: "warn",
    });
    const docs = await loader.load();
    return docs;
}

export async function loadDocumentByCheerio(url: string): Promise<Document[]> {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    return docs;
}

export async function loadDocuments(url: string, type?: string): Promise<Document[]> {
    if (type === 'github') {
        return await loadDocumentByGithub(url);
    } else {
        return await loadDocument(url);
    }
}
