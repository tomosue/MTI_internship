<template>
  <div style="padding-top: 50px">
    <Menu></Menu>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="user.userId" />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input
                type="password"
                placeholder="パスワード"
                v-model="user.password"
              />
            </div>
          </div>
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input
                type="text"
                placeholder="ニックネーム"
                v-model="user.nickName"
              />
            </div>
          </div>
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input type="text" placeholder="年齢" v-model.number="user.age" />
            </div>
          </div>
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="user outline icon"></i>
              <input
                type="text"
                placeholder="体重"
                v-model.number="user.weight"
              />
            </div>
          </div>
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="user outline icon"></i>
              <input
                type="text"
                placeholder="身長"
                v-model.number="user.height"
              />
            </div>
          </div>
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input" v-if="!isLogin">
              <label class="radiobutton"
                ><br />
                <input
                  class="gender"
                  type="radio"
                  name="gender"
                  value="male"
                  v-model="user.sex"
                />
              </label>
              <label class="gender">
                <i class="male icon"></i>
                <label>男性</label>
              </label>
              <label class="radiobutton"
                ><br />
                <input
                  class="gender"
                  type="radio"
                  name="gender"
                  value="female"
                  v-model="user.sex"
                />
              </label>
              <label class="gender">
                <i class="female icon"></i>
                <label>女性</label>
              </label>
            </div>
          </div>
          <div class="ui red message" v-if="(isLogin&&(!user.userId||!user.password))&&err">
            <ul class="list">
              <li v-if="!user.userId" class="err-msg">userIdを入力してください</li>
              <li v-if="!user.password" class="err-msg">パスワードを入力してください</li>
            </ul>
          </div>
          <div class="ui red message" v-if="(!isLogin&&(!user.userId||!user.password||!user.nickName||!user.age||!user.weight||!user.height))&&err">
            <ul class="list">
              <li v-if="!user.userId" class="err-msg">userIdを入力してください</li>
              <li v-if="!user.password" class="err-msg">パスワードを入力してください</li>
              <li v-if="!user.nickName" class="err-msg">ニックネームを入力してください</li>
              <li v-if="!user.age" class="err-msg">年齢を入力してください</li>
              <li v-if="!user.weight" class="err-msg">体重を入力してください</li>
              <li v-if="!user.height" class="err-msg">身長を入力してください</li>
            </ul>
          </div>
          <button class="ui huge green fluid button" type="submit">
            {{ submitText }}
          </button>
        </form>
      </div>
      <button
        @click="toggleMode()"
        class="ui huge grey fluid button"
        type="submit"
      >
        {{ toggleText }}
      </button>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import { baseUrl } from "@/assets/config.js";
import axios from "axios";
import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Login",
  components: {
    Menu,
    Footer,
  },
  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      isLogin: true,
      user: {
        userId: null,
        password: null,
        nickName: null,
        age: null,
        weight: null,
        height: null,
        sex: "male",
      },
      err: false,
    };
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      return this.isLogin ? "ログイン" : "新規登録";
    },
    toggleText() {
      return this.isLogin ? "新規登録" : "ログイン";
    },
  },
  created() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isLogin = !this.isLogin;
    },
    errMessage() {

    },
    submit() {
      if (this.isLogin) {
        if (!this.user.userId) {
          this.err = "userIdを入力してください";
        } else if (!this.user.password) {
          this.err = true;
        } else {
          // ログイン処理はここに
          const requestBody = {
            userId: this.user.userId,
            password: this.user.password,
          };
          axios
            .post(baseUrl + "/user/login", requestBody)
            .then((response) => {
              // 成功したときの処理はここに記述する
              console.log(response.data);
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("userId", this.user.userId);
              this.$router.push({ name: "Home" });
            })
            .catch(() => {
              // レスポンスがエラーで返ってきたときの処理はここに記述する
              this.err = "予期せぬエラーが発生しました";
            });
        }
        return;
      }
      if (!this.user.userId) {
        this.err = "userIdを入力してください";
      } else if (!this.user.password) {
        this.err = "パスワードを入力してください";
      } else if (!this.user.nickName) {
        this.err = "ニックネームを入力してください";
      } else if (!this.user.age) {
        this.err = "年齢を入力してください";
      } else if (!this.user.weight) {
        this.err = "体重を入力してください";
      } else if (!this.user.height) {
        this.err = "身長を入力してください";
      } else {
        // APIにPOSTリクエストを送る
        const requestBody = {
          userId: this.user.userId,
          password: this.user.password,
          nickName: this.user.nickName,
          age: this.user.age,
          weight: this.user.weight,
          height: this.user.height,
          sex: this.user.sex,
        };
        axios
          .post(baseUrl + "/user/register", requestBody)
          .then((response) => {
            // 成功したときの処理はここに記述する
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", this.user.userId);
            this.$router.push({ name: "Home" });
          })
          .catch(() => {
            // レスポンスがエラーで返ってきたときの処理はここに記述する
            this.err = "予期せぬエラーが発生しました";
          });
      }
    },
  },
};
</script>
<style scoped>
.radiobutton {
  margin-left: 10px;
}
.gender {
  margin-left: 5px;
  margin-top: 24px;
}
</style>
