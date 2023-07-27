const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

// 設定中間件以解析表單資料
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// 連接 MongoDB 資料庫
mongoose.connect('mongodb+srv://409630760:ray2340104@database.2fesecl.mongodb.net/data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('連結至MongoDB\n------------------------------'))
  .catch(error => console.error('MongoDB連結錯誤:', error));

// 建立 MongoDB 模型
const User = mongoose.model('user1', {
  account: String,
  password: String,
  content: {
    type: [String], // 將 content 定義為字串型別的陣列
    default: [] // 將預設值設置為空陣列
  }
});

let fileContentsArray = []; // 存放 aa.txt 的內容陣列

// 讀取 aa.txt 的內容，並存入全局陣列
fs.readFile('C:\\Users\\User\\OneDrive\\桌面\\aa.txt', 'utf8', (err, fileContent) => {
  if (err) {
    console.error('讀取錯誤:', err);
  } else {
    // 將 aa.txt 內容存入全局陣列
    fileContentsArray.push(fileContent);
  }
});

function updateFileContent(newContent, callback) {
  const filePath = 'C:\\Users\\User\\OneDrive\\桌面\\aa.txt';

  // 更新檔案為新內容
  fs.writeFile(filePath, newContent, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('更新檔案內容時發生錯誤:', writeErr);
      callback(writeErr);
    } else {
      console.log('檔案內容已成功更新。');

      // 每次都重新讀取 aa.txt 的內容並更新 fileContentsArray
      //以免只有程式啟動時檢查更新
      fs.readFile(filePath, 'utf8', (readErr, fileContent) => {
        if (readErr) {
          console.error('讀取錯誤:', readErr);
        } else {
          // 更新 fileContentsArray
          fileContentsArray.push(fileContent);
          console.log('新內容已存入全局陣列。');
        }
        callback(null);
      });
    }
  });
}

// 處理 POST 請求
app.post('/api/login', (req, res) => {
  const { account, password } = req.body;

  // 搜尋資料庫中是否已有該帳號
  User.findOne({ account: account })
    .then(user => {
      if (user) {
        // 確保 user.content 是一個陣列
        if (!Array.isArray(user.content)) {
          user.content = [];
        }
        // 帳號已存在，驗證密碼
        if (user.password === password) {
          console.log('登入成功\n');
          console.log('使用者帳號:', user.account, '\n使用者密碼:', user.password, '\nUser content:', user.content, '\n------------------------------');

          // 更新使用者的 content 屬性為 aa.txt 的內容
          user.content.push(fileContentsArray[fileContentsArray.length - 1]); // 將最後一個 aa.txt 內容新增至使用者的 content 陣列
          user.save()
            .then(() => {
              console.log('使用者內容已成功更新:', user, '\n------------------------------');

              // 更新 aa.txt 檔案內容
              updateFileContent(fileContentsArray[fileContentsArray.length - 1], (err) => {
                if (err) {
                  console.error('上傳內容錯誤:', err);
                  // Handle error if necessary
                }
              });
              // 將整個 content 陣列回傳給前端
              res.json({ contentArray: user.content });
            })
            .catch(error => {
              console.error('儲存至MongoDB錯誤:', error);
            });
        } else {
          console.log('帳號或密碼無效', '\n------------------------------');
          res.status(401).send('帳號或密碼無效');
        }
      }
    })
    .catch(error => {
      console.error('找不到使用者:', error);
      res.status(500).send('找不到使用者');
    });
});


//尋找所有 'content' 欄位為字串的文件，並將它們更新為空陣列
//以免資料型態出錯
User.updateMany(
  { content: { $type: 'string' } },
  { $set: { content: [] } }
)
  .then(() => {
    console.log('已更新存在問題的文件。');
  })
  .catch(error => {
    console.error('更新文件時出錯:', error);
  });

// 啟動伺服器
app.listen(3000, () => {
  console.log('Server started on port 3000\nhttp://localhost:3000/\n------------------------------');
});