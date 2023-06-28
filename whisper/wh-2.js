const axios = require('axios');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  

const apiKey = process.env.OPENAI_API_KEY;;
const whisperUrl = 'http://localhost:3000';

async function recognizeSpeech(audioData) {
  try {
    const response = await axios.post(whisperUrl, {
      audio: audioData,
      apikey: apiKey,
      language: 'zh'
    });

    // 提取辨識結果
    const { results } = response.data;

    // 輸出辨識結果
    console.log(results);

    // 在這裡可以進一步處理辨識結果或執行其他操作

  } catch (error) {
    console.error('發生錯誤：', error);
  }
}

// 使用範例
const audioPath = 'C://Users//acer//Desktop//vite//whisper//hi.m4a';

fs.readFile(audioPath, async (error, data) => {
  if (error) {
    console.error('無法讀取音訊檔案：', error);
    return;
  }

  // 將音訊檔案的資料作為參數傳遞給辨識函式
  await recognizeSpeech(data);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })