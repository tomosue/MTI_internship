<template>
  <div class="topsetting">
    <Menu current="exercise"></Menu>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <h2>カロリー摂取・消費状況</h2>
        <Chart />
        <div class="ui message">
          <div class="header">アドバイス</div>
          <div class="ui comments">
            <div class="comment">
              <a class="avatar">
                <img
                  src="https://semantic-ui.com/images/avatar/small/stevie.jpg"
                />
              </a>
              <div class="content">
                <a class="author">アドバイザー</a>
                <div class="text">
                  カロリー摂取が安定していません。安定した食生活にしましょう。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui segment">
        <h2>おすすめの運動</h2>
        <ul v-for="(data, index) in doneExercise" :key="index">
          <li>
            <h3>
              {{ data.details.name }}{{ " "
              }}{{ Math.floor(data.details.kcal * 100) / 100
              }}<span class="kcal"> Kcal</span>
            </h3>
          </li>
        </ul>
      </div>
      <div class="ui segment">
        <h2>運動の記録</h2>
        <div class="field">
          <form class="ui form">
            <div class="field">
              <label>行った運動を選択してください。</label>
            </div>

            <div class="ui grid">
              <div v-for="e in data" :key="e" class="four wide column">
                <!---->
                <div class="ui card">
                  <div class="content">
                    <h2 class="ui header">
                      <div class="sub header">
                        <h3>{{ e.name }}</h3>
                      </div>
                      <div class="sub header">メッツ:{{ e.mets }}</div>
                    </h2>
                    <div class="selectTime">
                      <label for="fruit">取り組んだ時間</label>
                      <select class="ui search dropdown" :id="e.name">
                        <option :value="n * 5" v-for="n of 12" :key="n"
                          >{{ n * 5 }} 分</option
                        >
                      </select>
                    </div>
                    <div class="selectTime">
                      <label>行った時間</label>
                      <input type="time" :id="e.name + 'timestamp'" />
                    </div>
                    <button
                      class="fluid ui green button"
                      type="button"
                      v-on:click="submit(e.name, e.mets)"
                    >
                      記録
                    </button>
                  </div>
                </div>
                <!---->
              </div>
            </div>
          </form>
        </div>
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
import Chart from "@/components/Chart.vue";
import { data } from "@/utils/exercise.js";
export default {
  name: "Exercise",
  components: {
    Menu,
    Chart,
    Footer,
  },
  data() {
    return { data, doneExercise: [] };
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    filterdUsers() {
      let result = [...this.users];
      if (this.nickname) {
        result = result.filter((target) => {
          if (target.nickname) {
            return target.nickname.match(this.nickname);
          } else {
            return;
          }
        });
      }
      if (this.start) {
        result = result.filter((target) => {
          return target.age >= this.start;
        });
      }
      if (this.end) {
        result = result.filter((target) => {
          return target.age <= this.end;
        });
      }
      return result;
    },
  },
  created() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    const token = localStorage.getItem("token");
    if (!token) this.$router.push({ name: "Login" });
    // axios
    //   .get(baseUrl + "/users")
    //   .then((response) => {
    //     // 成功したときの処理はここに記述する
    //     this.users = response.data.users;
    //   })
    //   .catch(() => {
    //     // レスポンスがエラーで返ってきたときの処理はここに記述する
    //   });

    //----------------------------------------------------------------------
    const user_id = localStorage.getItem("userId");
    const auth_token = localStorage.getItem("token");

    axios
      .get(baseUrl + "/user/logs/workout?userId=" + user_id, {
        headers: {
          token: auth_token,
        },
      })
      .then((response) => {
        // 成功したときの処理はここに記述する
        console.log("運動データ");
        console.log(response.data.data);
        this.doneExercise = response.data.data;
      })
      .catch((err) => {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        // window.alert("Chart:\n" + err);
        console.log(err);
      });
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    // METs × 体重（kg × 時間 × 1.05 ＝ 消費カロリー（kcal
    submit(exerciseName, mets) {
      //const weight = document.getElementById(exerciseName).value;
      //const element = document.getElementById(exerciseName);
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
          console.log(response.data.data.weight);

          const kcal = mets * response.data.data.weight * 1.05;

          const timestamp = document.getElementById(exerciseName + "timestamp")
            .value;

          //nullチェック
          if (!timestamp) {
            window.alert("行った時間が入力されていません。");
            return;
          }

          const today = new Date();
          const month = today.getMonth() + 1;
          const date = today.getDate();
          const UnixTimestamp = Date.parse(
            `${today.getFullYear()}-${month
              .toString()
              .padStart(2, "0")}-${date
              .toString()
              .padStart(2, "0")} ${timestamp}:00`
          );
          console.log(UnixTimestamp);

          //--PUT---
          const auth_token = localStorage.getItem("token");
          const user_id = localStorage.getItem("userId");
          const requestBody = {
            userId: user_id,
            logType: "workout",
            clear: true,
            timestamp: UnixTimestamp,
            details: {
              name: exerciseName,
              kcal: kcal,
            },
          };
          axios
            .put(baseUrl + "/user/logs/workout", requestBody, {
              headers: {
                token: auth_token,
              },
            })
            .then((response) => {
              // 成功したときの処理はここに記述する
              window.alert("記録しました。");
              console.log(response);
            })
            .catch((err) => {
              // レスポンスがエラーで返ってきたときの処理はここに記述する
              //window.alert(err);
              console.log(err);
            });
          //--------
        })
        .catch((err) => {
          // レスポンスがエラーで返ってきたときの処理はここに記述する
          console.log(err);
          window.alert("エラー");
        });
    },
  },
};
</script>
<style scoped>
.selectTime {
  margin-bottom: 5px;
  margin-top: 5px;
}
.kcal {
  font-size: 80%;
}
</style>
