import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { loadDocument } from "./webLoader";
import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { MyLogger } from './mylogger';
const logger = new MyLogger();

export async function loadDocumentByGithub(url: string): Promise<Document[]> {
    const loader = new GithubRepoLoader(url, {
        branch: "master",
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

export async function loadDocumentByRecursive(url: string) {
    const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

    const loader = new RecursiveUrlLoader(url, {
        extractor: compiledConvert,
        maxDepth: 1,
        excludeDirs: ["https://js.langchain.com/docs/api/"],
    });

    const docs = await loader.load();
    return docs;
}


export async function loadDocuments(url: string, type?: string): Promise<Document[]> {
    if (type === 'github') {
        return await loadDocumentByGithub(url);
    } else if (type === 'recursive') {
        return await loadDocumentByRecursive(url);
    } else {
        return await loadDocument(url);
    }
}