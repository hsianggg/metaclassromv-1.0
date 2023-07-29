const express = require('express');
const multer = require('multer');
const app = express();
const path = require("path");
const upload = multer({ dest: 'uploads/' });
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
    apiKey: "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", // 最新的
});
const openai = new OpenAIApi(configuration);
app.post('/transcribe', (req, res) => {
    // 在這裡處理上傳的語音檔案
    const file = req.file;
    //const filePath = path.join(__dirname, file.path);
    transcribeSpeech(file)
        .then(transcription => {
            console.log('語音轉錄結果：', transcription);
            res.send('語音轉錄完成');
        })
        .catch(error => {
            console.error('發生錯誤：', error);
            res.status(500).send('發生錯誤!');
        });
});

async function transcribeSpeech(file) {
    try {
        const resp = await openai.createTranscription(
            fs.createReadStream(file.path),
            "whisper-1"
        );

        // 提取有效的轉錄文本
        console.log("Response:", resp.data);
        const transcription = resp.data.text;
        console.log("Transcription:", transcription);
        return transcription;
    } catch (error) {
        console.error("發生錯誤：", error);
        throw error;
    }
}

app.use(express.static('public'));
app.listen(3000, () => {
    console.log('伺服器已啟動3000');
});
