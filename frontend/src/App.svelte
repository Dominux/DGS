<main>
  <canvas bind:this={el}></canvas>
</main>

<script lang="ts">
  import { onMount } from 'svelte'

  import PlayGround from './goban/sphere'

  let el

  onMount(() => {
    PlayGround.createScene(el)
  })
</script>

<style>
  canvas {
    min-width: 100%;
  }
</style>
