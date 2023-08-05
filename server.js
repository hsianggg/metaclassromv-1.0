const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

// 設定中間件以解析表單資料
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://409630760:ray2340104@database.2fesecl.mongodb.net/data', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB\n------------------------------'))
  .catch(error => console.error('MongoDB connection error:', error));

// 建立 MongoDB 模型
const User = mongoose.model('user1', {
  account: String,
  password: String
});

const ContentSchema = new mongoose.Schema({
  data: [String] // 使用陣列儲存所有的內容
});

const Content = mongoose.model('content', ContentSchema);

// 定義讀取並更新本地檔案的函式
function readAndUpdateFile() {
  const filePath = "C:\\Users\\User\\Desktop\\aa.txt";

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      console.error('讀取檔案錯誤:', err);
    } else {
      // 更新 MongoDB 中的 content
      Content.findOne({})
        .then((contentDoc) => {
          if (contentDoc) {
            // 若有先前的內容，則將新內容新增到陣列中
            contentDoc.data.push(fileData);
          } else {
            // 若還沒有 content 文件，則建立一個新的
            contentDoc = new Content({ data: [fileData] });
          }

          // 儲存更新後的 content
          contentDoc.save()
            .then(() => {
              console.log('內容已更新到 MongoDB:', fileData);
            })
            .catch(error => {
              console.error('上傳內容到 MongoDB 時發生錯誤:', error);
            });
        })
        .catch(error => {
          console.error('查詢 MongoDB 中的 content 時發生錯誤:', error);
        });
    }
  });
}

// 讀取並更新檔案每 30 秒
setInterval(readAndUpdateFile, 30000);

// 處理 POST 請求
app.post('/api/login', (req, res) => {
  const { account, password } = req.body;

  // 搜尋資料庫中是否已有該帳號
  User.findOne({ account: account })
    .then(user => {
      if (user) {
        // 帳號已存在，驗證密碼
        if (user.password === password) {
          console.log('Login successful\n');
          console.log('User account:', user.account, '\nUser password:', user.password, '\nUser content:', user.content, '\n------------------------------');
        } else {
          console.log('Invalid account or password');
        }
      } else {
        // 帳號不存在，新增使用者
        // 讀取本地文件内容
        
          const newUser = new User({ account, password });
          newUser.save()
            .then(() => {
              console.log('New User saved to MongoDB:', newUser);
            })
            .catch(error => {
              console.error('Error saving user to MongoDB:', error);
            });
        
      }
    })
    .catch(error => {
      console.error('Error searching user in MongoDB:', error);
      res.status(500).send('Error searching user');
    });
});


// 啟動伺服器
app.listen(3000, () => {
  console.log('Server started on port 3000\nhttp://localhost:3000/\n------------------------------');
});