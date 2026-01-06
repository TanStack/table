# Editable Data with TanStack Form

This example demonstrates integrating TanStack Form with TanStack Table for editable data management.

## Features

- **Form-based editing**: Each table cell is a form field managed by TanStack Form
- **Array field management**: Table data is stored as a form array with indexed field access
- **Validation**: Per-field Zod validation with error display
- **Form state tracking**: Dirty/pristine and valid/invalid indicators
- **Pagination & Filtering**: Full table features work with form-managed data

## Key Patterns

- `useAppForm` with `defaultValues: { data: [...] }` for array data
- `form.AppField name="data[${row.index}].fieldName"` for cell editing
- `table.Subscribe` for reactive table state
- `table.FlexRender` for cell rendering

## Running the Example

```bash
pnpm install
pnpm dev
```
