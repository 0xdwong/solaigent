import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";


export async function getVectorStroe() {
  const vectorStore = await Chroma.fromExistingCollection(
    new OpenAIEmbeddings(),
    { collectionName: "solana" }
  );
  return vectorStore;
}