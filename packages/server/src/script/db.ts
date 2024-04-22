import * as dbUtil from '../helpers/db'

async function main(){
    let results;

    let collectionName= 'solana';
    await dbUtil.addCollection(collectionName);
    const collections = await dbUtil.getCollections();

    await dbUtil.createDocument(collectionName, 'url1', ['id1','id2', 'id3']);
    await dbUtil.createDocument(collectionName, 'url2', ['id1','id2']);

    await dbUtil.createDocument(collectionName, 'url3', ['id1','id2']);
    const documents = await dbUtil.getDocuments(collectionName);
    console.log('==documents', documents);

    // const document = await dbUtil.getDocument(collectionName, 'url1');
    await dbUtil.removeDocument(collectionName, 'url3');
    const documents2 = await dbUtil.getDocuments(collectionName);
    console.log('==documents2', documents2);

    
    console.log('==results', results);
}

main();