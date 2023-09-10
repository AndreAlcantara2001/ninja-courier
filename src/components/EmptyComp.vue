<template>
  <div class="empty-wrapper">
    <img class="photo" :src="require(`../assets/${imgUrl}.svg`)" alt="">
    <p>{{ this.message }} <span v-if="estimateTime"> within {{ this.estimateTime }}mins</span></p>
    
  </div>
</template>

<script>

export default {

  props: [
    "message",
    "imgUrl",
    "estimateTime",
  ],
/* 
  setup(){

    const store = useStore()

    const estimateTime = computed(() => store.state.estimateTime)

    return{
      estimateTime
    }
  } */

}
</script>

<style lang="scss" scoped>
.empty-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;


  padding: 30px;

  justify-content: center;
  align-items: center;

  .photo {
    max-width: 100%;
  }

  p {

    margin: 15px auto;
    position: absolute;
    top: 0;
    // top: 32%;
    // left: 5%;
    font-size: 15px;
    font-weight: 500;

    color: #3f3d56;

    background-color: #e6e6e6;

    border-radius: 7px;

    padding: 0 5px;

  }
}
</style>