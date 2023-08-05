const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
  apiKey: "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", // 最新的
});
const openai = new OpenAIApi(configuration);
const filepath = "whisper/egg.m4a";

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

    const keywordResponses = {
      "雞蛋": "在最左邊那排。",
      "牛奶": "一樣在最左邊。",
      "幾位": "1位用餐。",
      "訂位":"有，我訂下午3點。",
      "餐點":"一杯果汁和雞腿餐。",
      "會員":"需要加購什麼嗎?",
      "加購":"需要袋子嗎?",
      "還需要":"還要一個蛋糕。\n這樣就好。",
      "請稍等":"謝謝。",
      "需要其他":"我想要再一個碗。",
      "哪一桌":"5號桌。",
      "刷卡":"刷卡，不用統編。",
      "載具":"不用，謝謝。",
      "售票機":"好的請來這邊。",
      "加值":"好的請來這邊。",
      "淡水":"搭乘紅線到最後一站。",
      "怎麼走":"下樓後在您右側。",
    };
    function getResponseByKeyword(keyword) {// 提示某個關鍵字的回應
      return keywordResponses[keyword] ;
    }
    let foundMatch = false;
 // 判斷轉錄中是否包含關鍵字，並提示相應的回應
 for (const keyword in keywordResponses){
 if (transcription.includes(keyword)){
  const response= getResponseByKeyword(keyword);
  console.log(response);
  foundMatch =true;
 }
 }if (!foundMatch) {
   console.log(text);
 
  }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

generateText();

