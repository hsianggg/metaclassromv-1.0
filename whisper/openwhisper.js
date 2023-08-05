const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const configuration = new Configuration({
  apiKey: "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", // 最新的 API 金鑰
});
const openai = new OpenAIApi(configuration);
const filepath = "/Users/xavier/Library/CloudStorage/OneDrive-淡江大學/企劃競賽/資管畢業專題/程式/metaclassromv-1.0-whisper-openai-azure-mongodb/whisper/egg.m4a";

// 回應關鍵字的對應表
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
    throw error; // 重新拋出錯誤，讓上層函式處理
  }
}

async function generateText() {
  try {
    const transcription = await transcribeSpeech();
    
    console.log("\n");

    let foundMatch = false;
    let matchedKeyword = null;
    for (const keyword in keywordResponses) {
      if (transcription.includes(keyword)) {
        const response = getResponseByKeyword(keyword);
        console.log(response);
        matchedKeyword = keyword;
        foundMatch = true;
      }
    }

    if (foundMatch) {
      // 將輸出的回應寫入對應的 txt 檔案
      fs.writeFile('openai-output.txt', keywordResponses[matchedKeyword], (err) => {
        if (err) {
          console.error('無法寫入檔案:', err);
        } else {
          console.log('已成功將回應內容寫入 openai-output.txt 檔案！');
        }
      });

      fs.writeFile("user-input.txt", matchedKeyword, (error) => {
        if (error) {
          console.error("無法寫入檔案：", error);
        } else {
          console.log("已成功輸出回應關鍵字至 user-input.txt 檔案");
        }
      });
    } else {
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

      // 將輸出的文字輸出成 txt 檔案
      fs.writeFile('openai-output.txt', text, (err) => {
        if (err) {
          console.error('無法寫入檔案:', err);
        } else {
          console.log('已成功將 text 內容寫入 openai-output.txt 檔案！');
        }
      });

      fs.writeFile("user-input.txt", transcription, (error) => {
        if (error) {
          console.error("無法寫入檔案：", error);
        } else {
          console.log("已成功輸出文字至 user-input.txt 檔案");
        }
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

function getResponseByKeyword(keyword) {
  return keywordResponses[keyword];
}

generateText();
