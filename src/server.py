from flask import Flask, request, jsonify
from flask_cors import CORS
import agent
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def post_example():
    req = request.get_json()  # 获取 POST 请求中的 JSON 数据
    
    userMsg = req['input']['question']

    generated = agent.invoke(userMsg)

    resp = {
        "code" : 0,
        "msg": "",
        "data": generated
    }

    return jsonify(resp)


# 运行应用
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
