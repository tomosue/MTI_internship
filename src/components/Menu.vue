<template>
  <div class="ui top fixed secondary pointing green inverted massive menu">
    <a
      class="item"
      @click="switchPage('Home')"
      v-bind:class="{ active: current == 'home' }"
      >Home</a
    >
    <a
      class="item"
      @click="switchPage('Exercise')"
      v-bind:class="{ active: current == 'exercise' }"
      >Exercise</a
    >
    <a
      class="item"
      @click="switchPage('Food')"
      v-bind:class="{ active: current == 'food' }"
      >Food</a
    >
    <a
      class="item"
      @click="switchPage('Profile')"
      v-bind:class="{ active: current == 'profile' }"
      >Profile</a
    >
    <div class="right menu">
      <button class="item" @click="logout">Logout</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Menu",
  props: {
    current: {
      type: String,
      required: true,
    },
  },
  methods: {
    switchPage(pageName) {
      this.$router.push({ name: pageName });
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
<style scoped></style>
