import { Module } from '@nestjs/common';
import { AppController } from './controllers/app';
import { AppService } from './services/app.service';
import { ChatController } from './controllers/chat';
import { ChatService } from './services/chat';
import { CollectionController } from './controllers/collection';
import { CollectionService } from './services/collection';
import { DocumentController } from './controllers/document';
import { DocumentService } from './services/document';

@Module({
  imports: [],
  controllers: [AppController, ChatController, CollectionController, DocumentController],
  providers: [AppService, ChatService, CollectionService, DocumentService],
})
export class AppModule { }
