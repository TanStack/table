<script lang="ts">
	import { cn, type WithElementRef } from "@/lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	class={cn("gap-2 text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none", className)}
	{...restProps}
>
	{@render children?.()}
</span>
