import * as dotenv from 'dotenv';
dotenv.config();
import { MyAgent } from '../agent'
import { HumanMessage, AIMessage } from "@langchain/core/messages";


async function chatByStream() {
  let agent = new MyAgent();

  const chatId = 'dfgerty45y5';
  const logStream = await agent.stream('My name is ddd');

  for await (const chunk of logStream) {
    if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
      const addOp = chunk.ops[0];
      if (
        addOp.path.startsWith("/logs/ChatOpenAI") &&
        typeof addOp.value === "string" &&
        addOp.value.length
      ) {
        console.log(addOp.value);
      }
    }
  }

  const logStream2 = await agent.stream('what is my name?');

  for await (const chunk of logStream2) {
    if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
      const addOp = chunk.ops[0];
      if (
        addOp.path.startsWith("/logs/ChatOpenAI") &&
        typeof addOp.value === "string" &&
        addOp.value.length
      ) {
        console.log(addOp.value);
      }
    }
  }
}

async function chat() {
  let agent = new MyAgent();

  const result = await agent.invoke('My name is ddd');
  console.log('====result====', JSON.stringify(result));

  const result2 = await agent.invoke('what is my name?');
  console.log('====result====', JSON.stringify(result2));
}

async function main() {
  // await chat();
  // await chatByStream();


  // const chunks = await (agent.llm().stream('what is bitcoin'));
  // for await (const chunk of chunks) {
  //   console.log(chunk.content);
  // }
  // 
}


main();