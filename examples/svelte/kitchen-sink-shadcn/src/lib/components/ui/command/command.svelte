<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "@/lib/utils.js";

	export type CommandRootApi = CommandPrimitive.Root;

	let {
		api = $bindable(null),
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: CommandPrimitive.RootProps & {
		api?: CommandRootApi | null;
	} = $props();
</script>

<CommandPrimitive.Root
	bind:this={api}
	bind:value
	bind:ref
	data-slot="command"
	class={cn("rounded-xl! bg-popover p-1 text-popover-foreground flex size-full flex-col overflow-hidden", className)}
	{...restProps}
/>
