import { Injectable } from '@nestjs/common';
import * as db from '../helpers/db';
import * as vector from '../utils/chroma';


@Injectable()
export class CollectionService {
  async getCollections(): Promise<string[]> {
    const collections = await db.getCollections();
    return collections;
  }

  async addCollection(name: string): Promise<boolean> {
    await vector.createCollection(name);
    await db.addCollection(name);

    return true;
  }
}