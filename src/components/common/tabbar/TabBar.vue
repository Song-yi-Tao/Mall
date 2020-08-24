<template>
    <div id="tab-bar">
        <slot></slot>
    </div>
</template>

<script>
export default {

}
</script>

<style>
#tab-bar{
  display: flex;
  background-color: #f2f2f2;
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 0px -3px rgba(0,0,0,0.3);
}

</style>