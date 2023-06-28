const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const configuration = new Configuration({
  apiKey:"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",
});

const openai = new OpenAIApi(configuration);
const filepath = "C://Users//acer//Desktop//ilearn//metaclassromv-1.0//whisper//howmuch.m4a"
async function transcribeSpeech() {
  try {
    const resp = await openai.createTranscription(
      fs.createReadStream(filepath),
      "whisper-1"
    );

    // 處理轉錄的回應
    console.log(resp);

    // 在這裡可以進一步處理回應或執行其他操作

  } catch (error) {
    console.error("發生錯誤：", error);
  }
}

// 使用範例
transcribeSpeech();