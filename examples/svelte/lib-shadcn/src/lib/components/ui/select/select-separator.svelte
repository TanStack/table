<script lang="ts">
	import { Separator } from "../separator/index.js";
	import { cn } from "@/lib/utils";
	import type { Separator as SeparatorPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<Separator
	bind:ref
	data-slot="select-separator"
	class={cn("-mx-1 my-1 h-px bg-border pointer-events-none", className)}
	{...restProps}
/>
