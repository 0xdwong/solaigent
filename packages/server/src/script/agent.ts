import * as dotenv from 'dotenv';
dotenv.config();
import { MyAgent } from '../agent'


async function chatByStream(query: string) {
  let agent = new MyAgent();

  const logStream = await agent.stream(query);

  let result = '';
  for await (const chunk of logStream) {
    if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
      const addOp = chunk.ops[0];
      if (
        addOp.path.startsWith("/logs/ChatOpenAI") &&
        typeof addOp.value === "string" &&
        addOp.value.length
      ) {
        console.log(addOp.value);
        result += addOp.value
      }
    }
  }

  console.log('====result====', JSON.stringify(result));
}

async function chat(query: string) {
  let agent = new MyAgent();
  const result = await agent.invoke(query);
  console.log('====result====', JSON.stringify(result));
}

async function main() {
  let query = `introduce MEV in solana`;
  // await chat(query);
  await chatByStream(query);


  // const chunks = await (agent.llm().stream('what is bitcoin'));
  // for await (const chunk of chunks) {
  //   console.log(chunk.content);
  // }
  // 
}


main();