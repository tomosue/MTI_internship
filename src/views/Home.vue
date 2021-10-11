<template>
  <div class="topsetting">
    <Menu current="home"></Menu>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <h2>{{ userData.nickName }} さん</h2>
        <div class="ui grid">
          <div class="ten wide column">
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>データ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Name">性別</td>
                  <td data-label="Age">
                    <p v-if="userData.sex === 'female'">
                      <i class="female icon"></i>女性
                    </p>
                    <p v-else><i class="male icon"></i>男性</p>
                  </td>
                </tr>
                <tr>
                  <td data-label="Name">年齢</td>
                  <td data-label="Age">{{ userData.age }} 歳</td>
                </tr>
                <tr>
                  <td data-label="Name">体重</td>
                  <td data-label="Age">{{ userData.weight }} Kg</td>
                </tr>
                <tr>
                  <td data-label="Name">身長</td>
                  <td data-label="Age">{{ userData.height }} cm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="six wide column">
            <div :class="'ui message ' + bmi.bmiMessageColor">
              <h3>あなたの状態</h3>
              <h1>BMI値 : {{ bmi.bmi }}</h1>
              <h2>あなたは {{ bmi.judgeBmi }} です。</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="ui segment">
        <h2>直近２週間のデータ</h2>
        <Chart />
      </div>
      <div class="ui segment">
        <div class="ui grid">
          <div class="eight wide column">
            <h3>運動に関するアドバイス</h3>
            <div class="ui comments">
              <div class="comment">
                <a class="avatar">
                  <img
                    src="https://semantic-ui.com/images/avatar/small/stevie.jpg"
                  />
                </a>
                <div class="content">
                  <a class="author">エクササイズアドバイザー</a>
                  <div class="text">
                    {{ bmi.bmiMessageExercise }}
                    <div class="ui card">
                      <div class="content">
                        <h2 class="ui header">
                          <div class="sub header">
                            筋トレ
                          </div>
                          腕立て
                          <div class="sub header">
                            メッツ:3.8
                          </div>
                        </h2>
                      </div>
                    </div>
                    <a
                      @click="switchPage('Exercise')"
                      style="cursor: hand; cursor:pointer;"
                      >もっと見る</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="eight wide column">
            <h3>食事に関するアドバイス</h3>
            <div class="ui comments">
              <div class="comment">
                <a class="avatar">
                  <img
                    src="https://semantic-ui.com/images/avatar/small/elliot.jpg"
                  />
                </a>
                <div class="content">
                  <a class="author">食のアドバイザー</a>
                  <div class="text">
                    {{ bmi.bmiMessageFood }}
                    <div class="ui card">
                      <div class="content">
                        <h2 class="ui header">
                          朝食
                          <div class="sub header">
                            <div class="ui middle aligned divided list">
                              <div class="item">
                                <div class="right floated content">
                                  0<span class="cardKcal"> Kcal</span>
                                </div>
                                <div class="content">
                                  ごはん
                                </div>
                              </div>
                              <div class="item">
                                <div class="right floated content">
                                  0<span class="cardKcal"> Kcal</span>
                                </div>
                                <div class="content">
                                  豚の生姜焼き
                                </div>
                              </div>
                              <div class="item">
                                <div class="right floated content">
                                  0<span class="cardKcal"> Kcal</span>
                                </div>
                                <div class="content">
                                  サラダ
                                </div>
                              </div>
                              <div class="item">
                                <div class="right floated content">
                                  0<span class="cardKcal"> Kcal</span>
                                </div>
                                <div class="content">
                                  卵スープ
                                </div>
                              </div>
                            </div>
                          </div>
                        </h2>
                      </div>
                    </div>
                    <a
                      @click="switchPage('Food')"
                      style="cursor: hand; cursor:pointer;"
                      >もっと見る</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// import { baseUrl } from '@/assets/config.js';
// import axios from "axios";
// 必要なものはここでインポートする
// @は/srcと同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from "@/assets/config.js";
import BMI from "@/utils/bmi";
import BmiMessage from "@/utils/bmiMessage";
import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";
import Chart from "@/components/Chart.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    // 読み込んだコンポーネント名をここに記述する
    Menu,
    Footer,
    Chart,
  },
  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      post: {
        text: null,
        category: null,
        err: null,
      },
      bmi: {
        bmi: null,
        judgeBmi: null,
        bmiMessageFood: null,
        bmiMessageExercise: null,
        bmiMessageColor: null,
      },
      search: {
        username: "",
        category: "",
        start: "",
        end: "",
        err: null,
      },
      query: {
        start: null,
        end: null,
      },
      userData: [],
      iam: null,
    };
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    sortedArticles() {
      // sort()は破壊的変更のため、一度コピーしてから使う
      const articles = [...this.articles];
      const sortedArticles = articles.sort((previos, next) => {
        return previos.timestamp - next.timestamp;
      });
      return sortedArticles;
    },
  },
  created() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    const token = localStorage.getItem("token");
    if (!token) this.$router.push({ name: "Login" });

    // this.iam = localStorage.getItem("userId");
    // // apiからarticleを取得する
    // this.getArticles();
    const auth_token = localStorage.getItem("token");
    const user_id = localStorage.getItem("userId");
    axios
      .get(baseUrl + "/user/profile?userId=" + user_id, {
        headers: {
          token: auth_token,
        },
      })
      .then((response) => {
        // 成功したときの処理はここに記述する
        console.log(response.data.data);
        this.userData = response.data.data;

        const bmi = BMI.calculationBMI(
          response.data.data.weight,
          response.data.data.height
        );
        this.bmi.bmi = Math.floor(bmi * 100) / 100;

        const judgeBmi = BMI.judgeBMI(bmi);
        this.bmi.judgeBmi = judgeBmi;

        this.bmi.bmiMessageFood = BmiMessage.messageFood(bmi);
        this.bmi.bmiMessageExercise = BmiMessage.messageExercise(bmi);
        this.bmi.bmiMessageColor = BmiMessage.messageColor(bmi);
      })
      .catch((err) => {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        console.log(err);
      });
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    switchPage(pageName) {
      this.$router.push({ name: pageName });
    },
    //
    getArticles() {
      axios
        .get(baseUrl + "/posts")
        .then((response) => {
          this.articles = response.data.posts;
        })
        .catch((e) => {
          throw new Error(e);
        });
    },
    // Vue.jsで使う関数はここで記述する
    postArticle() {
      if (!this.post.text || this.post.text.length == 0) {
        this.post.err = "投稿内容を入力してください";
        return;
      }
      const requestBody = {
        userId: this.iam,
        text: this.post.text,
        category: this.post.category,
      };
      axios
        .post(baseUrl + "/post", requestBody)
        .then(() => {
          this.post.text = null;
          this.post.category = null;
          this.post.err = null;
          this.getArticles();
        })
        .catch(() => {
          this.post.err = "予期せぬエラーが発生しました";
        });
    },
    searchArticle() {
      if (!this.search.username) {
        this.search.err = "userIdは必須です";
        return;
      } else if (this.search.start && !this.search.end) {
        this.search.err = "終了時刻も入力してください";
        return;
      } else {
        if (this.search.start) {
          this.query.start = Number(Date.parse(this.search.start));
          this.query.end = Number(Date.parse(this.search.end));
          if (this.query.start === this.query.end) {
            this.search.err = "開始日と終了日は同じ日付にできません";
            return;
          } else if (this.query.start > this.query.end) {
            this.search.err = "開始日を終了日より前に設定することはできません";
            return;
          }
        }
        if (!this.search.category) {
          this.search.category = "";
        }
        const startQuery = this.query.start ? `&start=${this.query.start}` : "";
        const endQuery = this.query.end ? `&end=${this.query.end}` : "";
        const categoryQuery = this.search.category
          ? `&category=${this.search.category}`
          : "";
        axios
          .get(
            baseUrl +
              "/post" +
              "?userId=" +
              this.search.username +
              startQuery +
              endQuery +
              categoryQuery
          )
          .then((response) => {
            // 成功したときの処理はここに記述する
            this.articles = response.data.articles;
            this.search.err = null;
          })
          .catch(() => {
            // レスポンスがエラーで返ってきたときの処理はここに記述する
            this.search.err = "予期せぬエラーが発生しました";
          });
      }
    },
    deleteArticle(article) {
      axios
        .delete(baseUrl + "/post", {
          data: {
            // Overwrite Axios's automatically set Content-Type
            userId: this.iam,
            timestamp: article.timestamp,
          },
        })
        .then(() => {
          this.getArticles();
        })
        .catch((e) => {
          throw new Error(e);
        });
    },
    fromUnixtoDate(timestamp) {
      const dt = new Date(timestamp);
      return (
        dt.getFullYear() +
        "/" +
        (dt.getMonth() + 1) +
        "/" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
  },
};
</script>
<style scoped>
.post-textarea {
  height: 150px;
  min-height: 50px;
  margin-bottom: 10px;
  overflow: scroll;
  border: 1px solid grey;
}

.post-category {
  width: 175px !important;
  height: 30px;
}

.post-inline {
  margin-top: 10px !important;
  position: relative;
}

.search-name,
.search-category {
  height: 30px;
}

.search-date-wrapper > label {
  margin-right: 10px !important;
}

.search-date {
  width: 160px !important;
  margin-right: 10px !important;
  height: 30px;
}

.article-username {
  margin: 0 0 5px 0;
}

.article-delete {
  position: absolute;
  right: 5px;
  top: 20px;
}

.err-msg {
  color: red;
  font-size: 15px;
  margin-bottom: 10px;
}
.comment {
  font-size: 120%;
}
.cardKcal {
  font-size: 70%;
}
</style>
