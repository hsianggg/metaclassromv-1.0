const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

// 設定中間件以解析表單資料
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());



mongoose.connect('mongodb+srv://409630760:ray2340104@database.2fesecl.mongodb.net/data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
  .then(() => console.log('Connected to MongoDB\n------------------------------'))
  .catch(error => console.error('MongoDB connection error:', error));

// 建立 MongoDB 模型
const User = mongoose.model('user1', {
  account: String,
  password: String,
  content: String
});

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
          console.log('Invalid account or password', '\n------------------------------');
          res.status(401).send('Invalid account or password');
        }
      } else {
        // 帳號不存在，新增使用者
        // 讀取本地文件内容
        fs.readFile('C:\\Users\\User\\OneDrive\\桌面\\aa.txt', 'utf8', (err, fileContent) => {
          if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
          }
          const newUser = new User({ account, password, content: fileContent });
          newUser.save()
            .then(() => {
              console.log('New User saved to MongoDB:', newUser, '\n------------------------------');
            })
            .catch(error => {
              console.error('Error saving user to MongoDB:', error);
            });
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
