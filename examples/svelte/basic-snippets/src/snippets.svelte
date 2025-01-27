<script module lang="ts">
  import { createRawSnippet } from 'svelte'

  export { capitalized, spectrum, countup }

  function getColor(value: number, min: number, max: number) {
    console.log(value, min, max)
    const ratio = (value - min) / (max - min)
    console.log(value - min, max - min, ratio)
    const hue = Math.floor(120 * ratio) // 0 (red) to 120 (green)
    return `hsl(${hue}, 100%, 50%)`
  }

  type SpectrumParams = {
    value: number
    min: number
    max: number
  }

  const countup = createRawSnippet<[value: number]>((value) => {
    return {
      render() {
        return `<p>0</p>`
      },
      setup(element) {
        let count = 0
        const interval = setInterval(() => {
          count++
          element.textContent = `${count}`

          if (count === value()) {
            clearInterval(interval)
          }
        }, 1000 / value())

        return () => {
          clearInterval(interval)
        }
      },
    }
  })
</script>

{#snippet capitalized(value: string)}
  <p class="text-capitalize">{value}</p>
{/snippet}

{#snippet spectrum({ value, min, max }: SpectrumParams)}
  <div
    class="text-center font-semibold"
    style="background-color: {getColor(value, min, max)}"
  >
    {value}
  </div>
{/snippet}
