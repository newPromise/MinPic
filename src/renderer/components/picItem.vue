<template>
  <div class="pic-item" :class="{'double-row': index % 2}">
    <div class="pic-name col-5">
      <img :src="img.src" alt="">
      <span class="name">{{img.name}}</span>
    </div>
    <div class="pic-size col-4">{{img.size}} MB / {{img.afterCompressSize}} MB</div>
    <!-- <div class="pic-create-time col-3">{{img.aTime}}</div> -->
    <div class="pic-operate col-2">
      <i class="el-icon-delete" @click="deleteImage"></i>
      <!-- <i class="el-icon-view" @click="deleteImage"></i> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      default: null,
      type: Object
    },
    index: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
    }
  },
  methods: {
    deleteImage() {
      this.$emit('delete', this.index)
    }
  },
}
</script>

<style lang="scss">
.double-row {
  background: #F5F4F5;
}
.pic-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 14px;
  color: #7B7A7B;
  > div {
    padding: 0 5px;
  }
  .pic-name {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img {
      width: 30px;
      max-height: 30px;
    }
    .name {
      display: inline-block;
      margin-left: 10px;
      font-size: 15px;
      color: black;
    }
  }
  .pic-operate {
    i {
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>