# Editable Data with TanStack Form

This example demonstrates integrating TanStack Form with TanStack Table for editable data management.

## Features

- **Form-based editing**: Each table cell is a form field managed by TanStack Form
- **Array field management**: Table data is stored as a form array with indexed field access
- **Schema validation**: Zod schemas are registered on the form instead of repeated on each field
- **Form state tracking**: Dirty/pristine and valid/invalid indicators
- **Submit patterns**: One table submits the whole form, and one table submits each row independently
- **Pagination, Sorting & Filtering**: Full table features work with form-managed data

## Key Patterns

- `useAppForm` with `defaultValues: { data: [...] }` for array data
- `form.AppField name="data[${row.index}].fieldName"` for cell editing
- Sort visual rows while field names still target the source row index from `row.index`
- `useAppForm` per row with `form.handleSubmit()` for row-level saves without a row `<form>` tag
- `form.Subscribe` for rendering save controls from row dirty/submitting state
- `table.FlexRender` for cell rendering

## Running the Example

```bash
pnpm install
pnpm dev
```
