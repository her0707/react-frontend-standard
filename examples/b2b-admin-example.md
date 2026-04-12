# B2B Admin Example

Recommended shape:

```text
src/
|-- screens/
|   |-- UserListScreen.tsx
|   `-- OrderDetailScreen.tsx
|-- features/
|   |-- user/
|   `-- order/
|-- components/
`-- lib/
```

Traits:

- feature ownership matches backend domains closely
- screens are thin
- `widgets` usually unnecessary
