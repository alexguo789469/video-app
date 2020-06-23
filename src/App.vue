<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepalive"/>
    </keep-alive>
      <router-view v-if="!$route.meta.keepalive"/>
  </div>
</template>

<style>
body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: #f4f4f4;
}

p{
  padding: 0;
  margin: 0;
}
</style>
