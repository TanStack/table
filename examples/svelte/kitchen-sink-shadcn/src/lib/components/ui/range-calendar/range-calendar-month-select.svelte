<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithoutChildrenOrChild } from "@/lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		onchange,
		...restProps
	}: WithoutChildrenOrChild<RangeCalendarPrimitive.MonthSelectProps> = $props();
</script>

<span
	class={cn(
		"relative flex rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50",
		className
	)}
>
	<RangeCalendarPrimitive.MonthSelect bind:ref class="absolute inset-0 opacity-0" {...restProps}>
		{#snippet child({ props, monthItems, selectedMonthItem })}
			<select {...props} {value} {onchange}>
				{#each monthItems as monthItem (monthItem.value)}
					<option
						value={monthItem.value}
						selected={value !== undefined
							? monthItem.value === value
							: monthItem.value === selectedMonthItem.value}
					>
						{monthItem.label}
					</option>
				{/each}
			</select>
			<span
				class="flex h-(--cell-size) items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
				aria-hidden="true"
			>
				{monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label}
				<ChevronDownIcon class={cn("size-4", className)} />
			</span>
		{/snippet}
	</RangeCalendarPrimitive.MonthSelect>
</span>
