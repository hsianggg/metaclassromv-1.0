const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
  apiKey: "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", // 最新的
});
const openai = new OpenAIApi(configuration);
const filepath = "C://Users//acer//Desktop//ilearn//metaclassromv-1.0//whisper//howmuch.m4a";

async function transcribeSpeech() {
  try {
    const resp = await openai.createTranscription(
      fs.createReadStream(filepath),
      "whisper-1"
    );

    // 提取有效的轉錄文本
    console.log("Response:", resp.data);
    const transcription = resp.data.text;
    console.log("Transcription:", transcription);
    return transcription;
  } catch (error) {
    console.error("發生錯誤：", error);
  }
}

async function generateText() {
  try {
    const transcription = await transcribeSpeech();
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: transcription,
      max_tokens: 128,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    const text = response.data.choices[0].text;
    console.log(text);

    // 將輸出的文字輸出成txt檔案
    fs.writeFile("output.txt", transcription, (error) => {
      if (error) {
        console.error("無法寫入檔案：", error);
      } else {
        console.log("已成功輸出文字至output.txt檔案");
      }
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

generateText();