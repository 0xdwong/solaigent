import { Controller, Get, Post, Req, Body, Query, Param } from '@nestjs/common';
import { ResponseData } from '../dto/response';
import { DocumentReq } from '../dto/document';
import { DocumentService } from '../services/document';
import { MyLogger } from '../utils/mylogger';
const logger = new MyLogger();


@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Get(':url')
    async get(@Param('url') url: string): Promise<ResponseData> {
        let respData = new ResponseData();

        // url = new URL(url).pathname;

        url = decodeURIComponent(url);

        let { collection, document } = await this.documentService.getDoculemt({ url });

        respData.data = {
            'url': url,
            'collection': collection,
            'document': document,
        }

        return respData;
    }

    @Get('/')
    async list(@Query() query: DocumentReq): Promise<ResponseData> {
        let respData = new ResponseData();

        const { collection } = query;

        if (!collection) {
            respData.code = -1;
            respData.msg = 'lack of params';
            return respData;
        }

        let urls = await this.documentService.list({ collection });

        respData.data = urls;
        return respData;
    }

    @Post('/create')
    async create(@Body() request: DocumentReq): Promise<ResponseData> {
        let respData = new ResponseData();

        const { collection, url, type = 'page' } = request;

        if (!collection || !url) {
            respData.code = -2;
            respData.msg = 'lack of params';
            return respData;
        }

        let collectionExits = await this.documentService.isCollectionExist(collection);
        if (!collectionExits) {
            respData.code = -3;
            respData.msg = 'collection not exists';
            return respData;
        }

        let docExits = await this.documentService.isCollectionHasDoc(collection, url);
        if (docExits) {
            logger.warn('already exists doc:', url);
            return respData;
        }

        let ids = await this.documentService.createDocument({ collection, url, type });

        if (ids.length === 0) {
            respData.code = -2;
            respData.msg = 'server error';
            return respData;
        }

        return respData;
    }

    @Post('/remove')
    async remove(@Body() request: DocumentReq): Promise<ResponseData> {
        let respData = new ResponseData();

        const { collection, url } = request;

        if (!collection || !url) {
            respData.code = -2;
            respData.msg = 'lack of params';
            return respData;
        }

        let succeed = await this.documentService.removeDocument({ collection, url });

        if (!succeed) {
            respData.code = -2;
            respData.msg = 'server error';
            return respData;
        }

        return respData;
    }

    @Post('/update')
    async update(@Body() request: DocumentReq): Promise<ResponseData> {
        let respData = new ResponseData();

        const { collection, url } = request;

        if (!collection || !url) {
            respData.code = -2;
            respData.msg = 'lack of params';
            return respData;
        }

        let succeed = await this.documentService.updateDocument({ collection, url });

        if (!succeed) {
            respData.code = -2;
            respData.msg = 'server error';
            return respData;
        }

        return respData;
    }
}