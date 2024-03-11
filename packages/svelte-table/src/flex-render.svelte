<!--
@component
A Svelte component that renders a cell or header, according to what was specified in the column definition.


```svelte
	<script>
		import { FlexRender, createSvelteTable, renderComponent } from '@tanstack/svelte-table';
		import ColorCell from './ColorCell.svelte';
		
		const columns = [
			{
				// The header will be `name`, and the cell will be the accessed value.
				accessor: 'name',
			}, 
			{
				// The header will be `Age`, and the cell will be the accessed value plus the string ` years old`.
				accessor: 'age',
				header: 'Age',
				cell(props) => props.getValue() + ' years old'
			}, 
			{
				// The header will be `Favorite Color`, and the cell will be a dynamically rendered Svelte component.
				accessor: 'favoriteColor',
				header: 'Favorite Color',
				cell: (props) => renderComponent(ColorCell, { color: props.getValue() })
			}
		];

		const table = createSvelteTable({ columns, ...restOptions })
	</script>

	<table>
		<thead>
			{#each table().getHeaderGroups() as headerGroup}
				<tr>
					{#each headerGroup.headers as header}
						<th colspan={header.colSpan}>
							<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each table().getRowModel().rows as row}
				<tr>
					{#each row.getVisibleCells() as cell}
						<td>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
```
-->

<script
	lang="ts"
	generics="TData, TValue, TContext extends object = HeaderOrCellContext<TData, TValue>"
>
	import type { ColumnDefTemplate } from '@tanstack/table-core';
	import { RenderComponentConfig } from './render-component';
	import type { HeaderOrCellContext } from './types';

	type Props = {
		/** The cell or header field of the current cell's column definition. */ 
		content: ColumnDefTemplate<TContext> | undefined;
		/** The result of the `getContext()` function of the header or cell */ 
		context: TContext;
	};

	let { content, context } = $props<Props>();
</script>



{#snippet componentCell()}
	{#if typeof content === 'string'}
		{content}
	{:else if content instanceof Function}
		{@const result = content(context)}
		{#if result instanceof RenderComponentConfig}
			<svelte:component this={result.component} {...result.props} />
		{:else}
			{result}
		{/if}
	{/if}
{/snippet}

{@render componentCell()}
