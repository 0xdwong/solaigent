from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import agent


app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    req = request.get_json()  # 获取 POST 请求中的 JSON 数据
    
    userMsg = req['input']['question']

    generated = agent.invoke(userMsg)

    resp = {
        "code" : 0,
        "msg": "",
        "data": generated
    }

    return jsonify(resp)


@app.route('/chat-stream', methods=['POST'])
def chat_by_stream():
    req = request.get_json()  # 获取 POST 请求中的 JSON 数据
    
    userMsg = req['input']['question']

    chunks = agent.stream(userMsg)

    return Response(chunks)


# 运行应用
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
