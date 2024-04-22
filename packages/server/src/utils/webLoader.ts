import { Document } from "@langchain/core/documents";
import axios from 'axios';
import { JSDOM } from "jsdom"
import TurndownService from "turndown"
import { Readability } from '@mozilla/readability';
import { MyLogger } from './mylogger';
const logger = new MyLogger();


export async function _loadByJinaAI(url: string): Promise<string> {
    let content = '';
    const BASE_API_URL = 'https://r.jina.ai/';
    try {
        const webUrl = BASE_API_URL + url;
        const response = await axios.get(webUrl, {
            timeout: 15 * 1000 // 设置超时时间为15秒
        });

        if (response.status === 200) {
            content = response.data;
            console.log('====web content====', content);
        }
    } catch (err) {
        console.error('====loadByJinaAI====', err);
    }

    return content;
}

export async function _loadDocument(url: string): Promise<string> {
    const turndownService = new TurndownService({
        headingStyle: 'atx', // #形式的标题
    });

    let content = '';
    try {
        // 使用JSDOM获取网页内容
        const dom = await JSDOM.fromURL(url);

        // 阅读模式下，帮助提取网页正文内容并过滤掉其他的非主要元素
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        const contentHtml = article.content;

        // html -> markdown
        content = turndownService.turndown(contentHtml); // 使用turndown将HTML内容转换为Markdown
    } catch (err) {
        logger.error('loadDocument failed', err);
    }

    return content;
}

export async function loadDocument(url: string): Promise<Document[]> {
    let docs: Document[] = [];

    let content = await _loadDocument(url); // or _loadByJinaAI(not unstable)

    docs.push({
        'pageContent': content,
        'metadata': {
            'source': url
        },
    })
    return docs;
}