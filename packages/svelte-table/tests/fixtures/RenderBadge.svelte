<script lang="ts">
  interface Props {
    label: string
  }

  let { label }: Props = $props()
</script>

<strong>{label}</strong>
