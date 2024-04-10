import { Injectable } from '@nestjs/common';
import { ChatReq } from '../dto/chat';
import { MyLogger } from '../utils/mylogger';
const logger = new MyLogger();
import * as agent from '../agent'


@Injectable()
export class ChatService {
  async chat(chatReq: ChatReq): Promise<any> {
    logger.debug('====chat====', chatReq);
    const usrMsg = chatReq.input.question;

    const output = await agent.invoke(usrMsg);

    return output;
  }

  async chatByStream(chatReq: ChatReq): Promise<any> {
    logger.debug('====chatByStream====', chatReq);
    const usrMsg = chatReq.input.question;

    const output = await agent.stream(usrMsg);
    
    return output;
  }
}