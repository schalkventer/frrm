<!-- omit in toc -->
# 🐇 frrm
[![](https://img.shields.io/npm/v/frrm](https://www.npmjs.com/package/frrm)
[![](https://img.shields.io/github/stars/schalkventer/frrm?style=social)](https://github.com/schalkventer/frrm)

**Tiny 0.1kb Zod-based form abstraction that goes brr**  

_⭐ If you find this tool useful please consider giving it a star on Github ⭐_

### Basic Usage

```js
  <img src="https://github.com/user-attachments/assets/99555850-ed74-4ef3-9c1d-f6256bf3bc58" width="500">
```

### React Usage

```jsx
import { z } from 'zod'
import { useState } from "react";
import { create } from "frr/react";

const fromServer = (submission) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (submission.email !== "john@example.com") return "Invalid email";
      if (submission.password !== "hunter2") return "Invalid password";
      resolve(undefined);
    }, 4000);
  });

const schema = z.object({
  email: z.string().min(1, { message: "Email value is required" }).email({
    message: "Email is not formatted correctly",
  }),
  password: z
    .string()
    .min(1, {
      message: "Password value is required",
    })
    .min(6, {
      message: "Password is required to be at least 6 characters",
    }),
});

const Example = () => {
  const [error, setError] = useState({ message: null });

  return (
    <form
      onSubmit={create({
        schema,
        onSubmit: fromServer,
        onError: setMessage,
      })}
    >
      <label>
        <span>Email:</span>
        <input type="email" name="email" />
      </label>

      <label>
        <span>Password:</span>
        <input type="password" name="password" />
      </label>

      <div style={{ }}>{error.message}</div>
      <button type="submit">Login</button>
    </form>
  );
};

```