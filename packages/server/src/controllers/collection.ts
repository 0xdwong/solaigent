import { Controller, Get, Post, Req, Body, Query } from '@nestjs/common';
import { ResponseData } from '../dto/response';
import { CollectionReq } from '../dto/collection';
import { CollectionService } from '../services/collection';


@Controller('collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) { }

    @Get('/')
    async list(): Promise<ResponseData> {
        let respData = new ResponseData();

        const collections = await this.collectionService.getCollections();

        respData.data = {
            "collections": collections
        }

        return respData;
    }

    @Post('create')
    async create(@Query() query: CollectionReq): Promise<ResponseData> {
        let respData = new ResponseData();

        const { name } = query;

        if (!name) {
            respData.code = -1;
            respData.msg = 'lack of params';
            return respData;
        }

        const succeed = await this.collectionService.addCollection(name);

        if (!succeed) {
            respData.code = -2;
            respData.msg = 'server error';
            return respData;
        }

        return respData;
    }
}