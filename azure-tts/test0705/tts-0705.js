// 安裝 axios 套件：npm install axios
import axios from 'axios';


function speak() {
  const subscriptionKey = '0854afd08d1a4bf08bb717c4158cc54e';
  const region = 'eastus'; // Azure 資源所在的區域
  const text = '你好，我是 Azure 語音服務。';
  const language = 'zh-TW'; 
  const baseUrl = `https://${region}.api.cognitive.microsoft.com`;

  const url = `${baseUrl}/cognitiveservices/v1`;
  const config = {
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
    }
  };
  
  const requestBody = `<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='${language}'><voice name='zh-TW-HanHanRUS'>${text}</voice></speak>`;

  axios.post(url, requestBody, config)
    .then(response => {
      // const audioData = response.data;
      // const audio = new Audio();
      // audio.src = URL.createObjectURL(new Blob([audioData], { type: 'audio/mp3' }));
      // audio.play();
      console.log(response);
    })
    .catch(error => {
      console.log('發生錯誤:', error);
    });
}
speak();