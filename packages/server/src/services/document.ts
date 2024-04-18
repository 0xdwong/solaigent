import { Injectable } from '@nestjs/common';
import { getDocument, addDoc2Collection, updateDoc, removeDocFromCollection } from '../utils/chroma';
import * as db from '../helpers/db';


@Injectable()
export class DocumentService {
  async list(params) {
    const { collection } = params;
    const urls = await db.getDocuments(collection);

    return urls;
  }

  async createDocument(params): Promise<string[]> {
    const { collection, url } = params;

    if (!this.isCollectionExist(collection)) return [];

    const ids = await addDoc2Collection(collection, url);

    if (ids.length > 0) {
      await db.createDocument(collection, url, ids);
    }

    return ids;
  }

  async getDoculemt(params) {
    let returnData = {
      'collection': '',
      'document': '',
    }

    const { url } = params;

    const collections = await db.getCollections();

    let exists = false;
    let targetCollection = '';

    for (let collection of collections) {
      exists = await db.hasDocument(collection, url);
      if (exists) {
        targetCollection = collection;
        break;
      }
    }

    if (!exists) return returnData;

    returnData.collection = targetCollection;
    let idsStr = await db.getDocument(targetCollection, url);
    const ids = idsStr.split(',');

    let documents = await getDocument(targetCollection, ids);
    returnData.document = documents.join('\n');

    return returnData
  }

  async removeDocument(params): Promise<boolean> {
    const { collection, url } = params;

    const idsString = await db.getDocument(collection, url);
    if (!idsString) return true;

    const ids = idsString.split(',');

    let succeed = await db.removeDocument(collection, url);
    if (!succeed) return false;

    succeed = await removeDocFromCollection(collection, ids);

    return succeed;
  }

  async updateDocument(params): Promise<boolean> {
    const { collection, url } = params;
    let succeed = true;

    // check if need to remove old
    const idsString = await db.getDocument(collection, url);
    if (idsString) {
      // remove old if exist 
      const oldIds = idsString.split(',');

      // remove from db
      await db.removeDocument(collection, url);

      // TODO: remove from vectore
      await removeDocFromCollection(collection, oldIds);
    }

    // vectore update
    const ids = await updateDoc(collection, url);

    if (ids.length > 0) {
      succeed = await db.updateDocument(collection, url, ids);
    }

    return succeed;
  }

  async isCollectionExist(name: string) {
    const collections = await db.getCollections();
    return collections.includes(name);
  }

  async isCollectionHasDoc(collection: string, docUrl: string) {
    const collections = await db.getCollections();
    let collectionExists = collections.includes(collection);
    if (!collectionExists) return false;

    return await db.hasDocument(collection, docUrl);
  }
}