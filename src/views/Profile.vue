<template>
  <div style="padding-top: 50px">
    <Menu current="profile"></Menu>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input
                type="text"
                placeholder="ID"
                v-model="user.userId"
                required
                disabled
              />
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
          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input
                type="text"
                placeholder="ニックネーム"
                v-model="user.nickName"
              />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input type="text" placeholder="年齢" v-model.number="user.age" />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="user outline icon"></i>
              <input 
                type="text" 
                placeholder="体重" 
                v-model.number="user.weight" 
              />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="user outline icon"></i>
              <input 
                type="text" 
                placeholder="身長" 
                v-model.number="user.height" 
              />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
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
          <div class="ui red message" v-if="(!user.userId||!user.password||!user.nickName||!user.age||!user.weight||!user.height)&&err">
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
            更新
          </button>
        </form>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";
import { baseUrl } from "@/assets/config.js";
import axios from "axios";

export default {
  name: "Profile",
  components: {
    Menu,
    Footer,
  },
  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      user: {
        userId: localStorage.getItem("userId"),
        password: null,
        nickName: null,
        age: null,
        weight: null,
        height: null,
        sex: null,
      },
      err: null,
    };
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },
  created() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    const token = localStorage.getItem("token");
    if (!token) this.$router.push({ name: "Login" });
    const config = {
      headers: {
        token: "mti-2021-final",
      },
    };
    axios
      .get(baseUrl + "/user/profile" + "?userId=" + this.user.userId, config)
      .then((response) => {
        // 成功したときの処理はここに記述する
        console.log(response);
        this.user = response.data.data;
      })
      .catch(() => {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        this.err = "予期せぬエラーが発生しました";
      });
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    submit() {
      if (!this.user.password) {
        this.err = "パスワードを入力してください";
        return;
      } else if (!this.user.nickName) {
        this.err = "ニックネームを入力してください";
        return;
      } else if (!this.user.age) {
        this.err = "年齢を入力してください";
        return;
      } else if (!this.user.weight) {
        this.err = "体重を入力してください";
        return;
      } else if (!this.user.height) {
        this.err = "身長を入力してください";
        return;
      }
      const requestBody = {
        userId: this.user.userId,
        password: this.user.password,
        nickName: this.user.nickName,
        age: this.user.age,
        weight: this.user.weight,
        height: this.user.height,
        sex: this.user.sex,
      };
      const config = {
        headers: {
          token: "mti-2021-final",
        },
      };
      axios
        .put(baseUrl + "/user/profile", requestBody, config)
        .then(() => {
          // 成功したときの処理はここに記述する
          this.$router.push({ name: "Home" });
        })
        .catch((e) => {
          // レスポンスがエラーで返ってきたときの処理はここに記述する
          throw new Error(e);
        });
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
