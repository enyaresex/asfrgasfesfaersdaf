### Types vs Interfaces

Use basic `type` when possible. It is enough for component props, API responses and such. `interface`s come in handy only in cases like function typings.

incorrect:

```typescript
interface Props {
  title: string;
}
```

correct:

```typescript
type Props = {
  title: string,
};

interface SomeFunction {
  (arg1: string): string;
}
```

### Function declarations

Use good ol' functions instead of [arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

incorrect:

```typescript jsx
const Title = ({ children }: Props) => (
  <div>
    { /* ... */}
  </div>
);

export default Title;
```

correct:

```typescript jsx
export default function Title({ children, ...props }: Props) {
  return (
    <div>
      { /* ... */}
    </div>
  );
}
```
