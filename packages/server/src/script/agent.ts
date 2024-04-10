import * as dotenv from 'dotenv';
dotenv.config();
import * as agent from '../agent'
import { HumanMessage, AIMessage } from "@langchain/core/messages";


async function main() {
  // const result = await agent.invoke('what is bitcoin');
  // console.log('====result====', JSON.stringify(result) );

  // const chunks = await agent.stream('what is solana');
  // for await (const chunk of chunks) {
  //   console.log(chunk);
  // }

  // const chunks = await (agent.llm().stream('what is bitcoin'));
  // for await (const chunk of chunks) {
  //   console.log(chunk.content);
  // }

  const logStream = await agent.stream('what is solana');

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
}


main();