import axios from 'axios';
import fs from 'fs';

async function speak() {
  const subscriptionKey = '0854afd08d1a4bf08bb717c4158cc54e';
  const region = 'eastus'; // Azure 资源所在的区域
  const text = '你好，我是 Azure 语音服务。';
  const language = 'zh-TW';
  const voiceName = 'zh-TW-HanHanRUS'; // 语音名称，例如：zh-TW-HanHanRUS
  const outputFile = 'output.mp3'; // 输出音频文件名

  const baseUrl = `https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

  const config = {
    headers: {
      'Authorization': `Bearer ${await getAccessToken(subscriptionKey, baseUrl)}`,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
    },
    responseType: 'arraybuffer'
  };

  const requestBody = `<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='${language}'><voice name='${voiceName}'>${text}</voice></speak>`;

  try {
    const response = await axios.post(baseUrl, requestBody, config);
    fs.writeFileSync(outputFile, response.data);
    console.log('语音输出完成！');
  } catch (error) {
    console.log('发生错误:', error);
  }
}

async function getAccessToken(subscriptionKey, baseUrl) {
  const response = await axios.post(baseUrl, null, {
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  });
  return response.data;
}

speak();
