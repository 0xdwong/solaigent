import { Injectable } from '@nestjs/common';
import { ChatReq } from '../dto/chat';
import { MyLogger } from '../utils/mylogger';
const logger = new MyLogger();
import { MyAgent } from '../agent'

@Injectable()
export class ChatService {
  private static agent: MyAgent;

  constructor() {
    ChatService.agent = new MyAgent();
  }

  async chat(chatReq: ChatReq): Promise<any> {
    logger.debug('====chat====', chatReq);
    const usrMsg = chatReq.input.question;
    const chatId = chatReq.uuid;

    const output = await ChatService.agent.invoke(usrMsg, chatId);

    return output;
  }

  async chatByStream(chatReq: ChatReq): Promise<any> {
    logger.debug('====chatByStream====', chatReq);
    const usrMsg = chatReq.input.question;
    const chatId = chatReq.uuid;
    console.log('====chatId====', chatId);

    const output = await ChatService.agent.stream(usrMsg, chatId);

    return output;
  }
}