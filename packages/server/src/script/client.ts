
import axios from 'axios';

const BASE_API_URL = 'http://127.0.0.1:8000';

async function chatByStream() {
    console.time('====chatByStream time====');
    const response = await axios({
        method: 'post',
        url: BASE_API_URL + '/chat/stream',
        responseType: 'stream',
        data: {
            "input": {
                "question": "what is solana"
            },
            "uuid": "5445674566b4455t345"
        }
    })

    let data = '';

    response.data.on('data', (chunk) => {
        data += chunk.toString();
        console.log('==client receive==', chunk.toString())
    });

    response.data.on('end', () => {
        console.log('====chatByStream final content====\n', data);
        console.timeEnd('====chatByStream time====');
    });
}

chatByStream();