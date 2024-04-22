import Redis from 'ioredis';
const redis = new Redis();
const REDIS_KEY_PREFIX = `solaigent`;
import { MyLogger } from '../utils/mylogger';
const logger = new MyLogger();


export async function addCollection(collection: string) {
    await redis.sadd(`${REDIS_KEY_PREFIX}_collection`, collection);
    return true;
}

export async function getCollections() {
    const collections = await redis.smembers(`${REDIS_KEY_PREFIX}_collection`);
    return collections;
}

export async function getDocuments(collection: string,) {
    const docs = await redis.smembers(`${REDIS_KEY_PREFIX}_${collection}`);
    return docs;
}

export async function getDocument(collection: string, url: string): Promise<string | null> {
    const ids = await redis.get(`${REDIS_KEY_PREFIX}_${collection}_${url}`);
    return ids;
}

export async function createDocument(collection: string, url: string, ids: string[]) {
    // add to set
    await redis.sadd(`${REDIS_KEY_PREFIX}_${collection}`, url);

    // add new ids
    await redis.set(`${REDIS_KEY_PREFIX}_${collection}_${url}`, ids.join(','));
    return true;
}

export async function updateDocument(collection: string, url: string, ids: string[]) {
    // readd to set
    await redis.sadd(`${REDIS_KEY_PREFIX}_${collection}`, url);

    // update new ids
    await redis.set(`${REDIS_KEY_PREFIX}_${collection}_${url}`, ids.join(','));

    return true;
}

export async function removeDocument(collection: string, url: string): Promise<boolean> {
    let succeed = false;;

    try {
        //remove url from set
        await redis.srem(`${REDIS_KEY_PREFIX}_${collection}`, url);

        // remove ids
        await redis.del(`${REDIS_KEY_PREFIX}_${collection}_${url}`);
        succeed = true;
    } catch (err) {
        logger.error('====removeDocument====', err)
    }

    return succeed;
}

export async function hasDocument(collection: string, url: string): Promise<boolean> {
    let result = await redis.sismember(`${REDIS_KEY_PREFIX}_${collection}`, url);
    return result === 1;
}