<template>
  <div class="p-3 shadow-md my-3 rounded-md flex gap-x-4 justify-between">
    <div>
      <p class="text-sm text-gray-400">筋トレ</p>
      <p class="text-lg font-bold">{{ name }}</p>
      <div class="flex gap-x-3 items-center text-gray-400 text-sm">
        <p>カロリー : {{ kcal }}</p>
        <p>回数 : {{ repeat }}</p>
      </div>
    </div>
    <div class="flex justify-center items-center flex-shrink-0">
      <div
        class="border text-green-400 border-green-400 w-16 h-16 rounded-full flex justify-center items-center cursor-pointer select-none hover:(bg-green-400 text-white)"
      >
        Clear
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'kcal', 'repeat'],
}
</script>
