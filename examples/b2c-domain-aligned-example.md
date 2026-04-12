# B2C Domain-Aligned Example

Example: course enrollment or ticket reservation where screens still map cleanly to backend domains or stable use cases.

```text
src/
|-- screens/
|   |-- CourseListScreen.tsx
|   `-- ReservationSearchScreen.tsx
|-- features/
|   |-- course/
|   |-- reservation/
|   |-- station/
|   `-- ticket/
`-- components/
```

Traits:

- still feature-centered
- screen composition stays thin
- frontend use-case features are allowed when they are stable and meaningful
