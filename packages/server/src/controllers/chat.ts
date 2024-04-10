import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express'
import { ResponseData } from '../dto/response';
import { ChatService } from '../services/chat';
import { ChatReq } from '../dto/chat';
import { Readable } from 'stream';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post('/')
  async chat(@Body() chatReq: ChatReq): Promise<ResponseData> {
    let respData = new ResponseData();

    const userMsg = chatReq.input.question;
    if (!userMsg) {
      respData.code = -1;
      respData.msg = 'lack of params';
      return respData;
    };

    let output = await this.chatService.chat(chatReq);
    if (!output) {
      respData.code = -2;
      respData.msg = 'server error';
      return respData;
    };

    respData.data = {
      "output": {
        "content": output,
      }
    }

    return respData;
  }

  @Post('/stream')
  async chatByStream(@Res() res: Response, @Body() chatReq: ChatReq): Promise<any> {
    let respData = new ResponseData();

    const userMsg = chatReq.input.question;
    if (!userMsg) {
      respData.code = -1;
      respData.msg = 'lack of params';
      return respData;
    };

    let logStream = await this.chatService.chatByStream(chatReq);
    if (!logStream) {
      respData.code = -2;
      respData.msg = 'server error';
      return respData;
    }

    const readStream = new Readable();
    readStream._read = () => { };
    readStream.pipe(res);

    for await (const chunk of logStream) {
      if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
        const addOp = chunk.ops[0];
        if (
          addOp.path.startsWith("/logs/ChatOpenAI") &&
          typeof addOp.value === "string" &&
          addOp.value.length
        ) {
          // console.log(addOp.value);
          readStream.push(addOp.value);
        }
      }
    }

    readStream.push(null);

    // for await (const chunk of stream) {
    //   if(chunk){
    //     readStream.push(chunk);
    //   }
    // }
    // readStream.push(null);

    //TODO: replace
    // const readStream = new Readable();
    // readStream._read = () => { };
    // readStream.pipe(res);

    // stream.on('data', (chunk) => {
    //   const content = chunk.toString();
    //   readStream.push(content);
    // })

    // stream.on('end', async () => {
    //   readStream.push(null);
    // })
  }
}