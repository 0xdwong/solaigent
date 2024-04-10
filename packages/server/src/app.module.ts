import { Module } from '@nestjs/common';
import { AppController } from './controllers/app';
import { AppService } from './services/app.service';
import { ChatController } from './controllers/chat';
import { ChatService } from './services/chat';

@Module({
  imports: [],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService],
})
export class AppModule { }
