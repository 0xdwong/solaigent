import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";


export async function getVectorStroe() {
  const vectorStore = await Chroma.fromExistingCollection(
    new OpenAIEmbeddings(),
    { collectionName: "my_collection4" }
  );
  return vectorStore;
}