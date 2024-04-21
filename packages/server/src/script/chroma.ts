import * as dotenv from 'dotenv';
dotenv.config();
import * as chroma from "../utils/chroma";
import * as docLoader from "../utils/docLoader";


// async function createCollection(name: string) {
//     const collection = await client.createCollection({
//         name: name,
//         embeddingFunction: embedder,
//     });
//     return collection
// }

// async function getCollection(name: string) {
//     let collection = await client.getCollection({
//         name: name,
//         embeddingFunction: embedder,
//     });
//     return collection;
// }

// async function query(name: string, query: string[]) {
//     const collection = await getCollection(name)

//     const results = await collection.query({
//         nResults: 2,
//         queryTexts: query,
//     });
//     return results;
// }

// async function getDocsById(name: string, ids: string) {
//     const collection = await getCollection(name);
//     const response = await collection.get({
//         ids: ids.split(','),
//     });
//     return response.documents.join('\n');
// }

async function main() {
    const collectionName = 'test';
    // const url = 'https://www.helius.dev/blog/solana-mev-an-introduction';
    const url = 'https://learnblockchain.cn/article/7947';


    await chroma.createCollection(collectionName);

    const docs = await docLoader.loadDocuments(url);
    let results = await chroma.addDocs2Collection(collectionName, docs);

    // const results = await query(collectionName, ["bome"])

    // const results = await getDocsById(collectionName, '122763038,144805634');
    console.log('==results==', results)
}

main()