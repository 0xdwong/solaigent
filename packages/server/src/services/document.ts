import { Injectable } from '@nestjs/common';
import { addDoc2Collection, updateDoc } from '../utils/chroma';
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
    returnData.document = await db.getDocument(targetCollection, url);

    return returnData
  }

  async removeDocument(params) {
    const { collection, url } = params;

    const succeed = await db.removeDocument(collection, url);
    // TODO: chrom remove

    return succeed;
  }

  async updateDocument(params): Promise<boolean> {
    const { collection, url } = params;
    let succeed = true;

    // TODO:vectore update
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