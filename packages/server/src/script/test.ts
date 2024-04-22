import * as dotenv from 'dotenv';
dotenv.config();
import * as chroma from "../utils/chroma";
import * as docLoader from "../utils/docLoader";


function getUrlPath() {
    const urlString = "http://example.com/url/https://www.helius.dev/blog/proof-of-history-proof-of-stake-proof-of-work-explained";
    const url = new URL(urlString);
    console.log(url);
}


async function getDocuments() {
    let result;
    // getDocument('solana', ['68577783', '61017509']);

    // webLoader tests
    // const url = 'https://learnblockchain.cn/article/2661';
    // result = await loadDocumentByCheerio(url);
    // result = await loadDocument(url);

    // const url = 'https://www.helius.dev/blog/solana-mev-an-introduction';
    // const url = 'https://github.com/solana-foundation/developer-content/docs';
    const url = "https://js.langchain.com/docs/get_started/introduction";

    const docs = await docLoader.loadDocuments(url, 'recursive');

    console.log(docs);
}

async function main() {
    // https://www.helius.dev/blog/proof-of-history-proof-of-stake-proof-of-work-explained
    // https%3A%2F%2Fwww.helius.dev%2Fblog%2Fproof-of-history-proof-of-stake-proof-of-work-explained

    // https://learnblockchain.cn/article/2661
    // https%3A%2F%2Flearnblockchain.cn%2Farticle%2F2661

    // https://solana.com/docs
    // https%3A%2F%2Fsolana.com%2Fdocs


    await getDocuments();
}

main();