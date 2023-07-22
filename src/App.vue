<template>
  <h1>登入</h1>
  <form @submit="handleSubmit">
    <label>帳號:</label>
    <input type="text" required v-model="account">
    <label>密碼:</label>
    <input type="password" required v-model="password">
    <div v-if="passwordError" class="error">{{ passwordError }}</div>
    <div class="terms">
      <input type="checkbox" v-model="terms" required>
      <label>同意所有條款</label>
    </div>
    <div class="submit">
      <button type="submit">確認</button>
    </div>
  </form>
  <p>帳號: {{ account }}</p>
  <p>密碼: {{ password }}</p>
  <p>Terms accept: {{ terms }}</p>
   <div>
    <h1>錯誤</h1>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
<script>
// 在 Vue 組件中使用 axios
import axios from 'axios';

export default {
  data() {
    return {
      account: '',
      password: '',
      terms: false,
      passwordError: ''
    };
  },
  methods: {
    handleSubmit(event) {
      this.passwordError = this.password.length > 5 ? '' : '密碼至少需要6個字元';

      if (!this.passwordError) {
        const formData = {
          account: this.account,
          password: this.password,
        };

        axios.post('http://localhost:3000/api/login', formData)
          .then(response => {
            console.log(response.data);
            this.account = response.data.account; // 將帳號值指派給 account 變數
            this.password = response.data.password; // 將密碼值指派給 password 變數
          })
          .catch(error => {
            console.error(error);
            this.error = error.response.data; // 將伺服器回應的錯誤訊息儲存到 error 屬性中
            // 處理錯誤回應
            // 使用 window.alert() 顯示錯誤訊息
        window.alert(this.error);
          });
      } else {
        event.preventDefault(); // 防止表單提交
      }
    },
  },
  mounted() {
    // 向伺服器發送 GET 請求
    axios.get('http://localhost:3000/api/users')
      .then(response => {
        this.users = response.data; // 將伺服器返回的使用者資料存儲在 users 屬性中
      })
      .catch(error => {
        console.error('Error fetching users from server:', error);
      });
  }
};
</script>
<style>
h1 {
  color: black;
}
form {
  max-width: 540px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
label {
  color: #aaa;
  display: inline-block;
  margin: 15px 0 15px;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
}
input,
select {
  display: block;
  padding: 5px 10px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
input[type="checkbox"] {
  display: inline-block;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}
button {
  background: #0b6dff;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
}
.submit {
  text-align: center;
}
.error {
  color: #ff0062;
  margin-top: 10px;
  font-size: 0.8em;
  font-weight: bold;
}
</style>