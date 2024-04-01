import requests


def chat():
    inputs = {"input": {"input": "Tiny SPL是什么？", "chat_history": []}}

    response = requests.post("http://localhost:8000/invoke", json=inputs)

    result = response.json()
    print(result["output"])


def chat_stream():
    url = 'http://localhost:8000/chat-stream'
    inputs = {
                "input": {
                  "question": "Tiny SPL是什么？",
                },
            }

    # 发起 GET 请求
    response = requests.post(url, json=inputs, stream=True)

    for chunk in response.iter_content(chunk_size=None, decode_unicode=True): 
        if chunk: # 过滤掉keep-alive新的块
            print(chunk)

    response.close()

chat_stream()

