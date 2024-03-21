from langchain_community.retrievers import TavilySearchAPIRetriever
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.utils import Output
import os
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')

retriever = TavilySearchAPIRetriever(api_key=TAVILY_API_KEY)

prompt = ChatPromptTemplate.from_template(
    """You are a expert in Solana. There may be context provided below, if so, you should also refer to the context when answering.

Context: {context}

Question: {question}"""
)

chain = (
    RunnablePassthrough.assign(
        context=(lambda x: x["question"]) | retriever) | prompt
    | ChatOpenAI(model="gpt-3.5-turbo")
    | StrOutputParser()
)


def invoke(msg:str) -> Output:
    result = chain.invoke({"question": msg})
    print(result)
    return result
