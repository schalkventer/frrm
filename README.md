<!-- omit in toc -->
# 🐇 frrm
[![](https://img.shields.io/npm/v/frrm)](https://www.npmjs.com/package/frrm)
[![](https://img.shields.io/github/stars/schalkventer/frrm?style=social)](https://github.com/schalkventer/frrm)

**Tiny Zod-based, HTML form abstraction that goes brr.**  

_⭐ If you find this tool useful please consider giving it a star on Github ⭐_

<img src="https://github.com/user-attachments/assets/7523e907-893a-4540-bc8a-b6800fb8c566" width="500">

- [Basic Example](#basic-example)
  - [JavaScript](#javascript)
  - [CSS](#css)
  - [Server](#server)
  - [HTML](#html)
- [React Example](#react-example)

# Basic Example

## JavaScript

```ts
import { create } from 'frrm'
import { z } from 'zod'
import { schema } from './schema'
import { httpExample } from './server'

create({
  onSubmit: httpExample,
  form: document.querySelector('#form'),

  schema: z.object({
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
  }),
  
  onError: (error) => {
    const element = document.querySelector('#error');
    if (!error.value) element.innerHTML = '';
    else element.innerHTML = `<div class="message">${error.value}</div>`;
  },

  onBusy: (busy) => {
    const button = document.querySelector('button');
    button.disabled = busy;
    button.innerHTML = busy ? 'Processing...' : 'Login';
  }
})
```

## CSS

```css
@keyframes enter {
  from {
    transform: translateY(-0.2rem);
    opacity: 0.5;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.message {
  background: rgba(255, 0, 0, 0.05);
  padding: 1rem;
  animation: enter 0.3s ease;
}
```

## Server

```ts
const httpExample = (submission: {
  email: string;
  password: string;
}): Promise<void | string> =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(123);
      if (submission.email !== "john@example.com") resolve("Invalid email");
      if (submission.password !== "hunter2") resolve("Invalid password");
      resolve(undefined);
    }, 4000);
  });
```

## HTML

```html
<form
  id="form"
  class="form"
>
  <label>
    <span>Email:</span>
    <input disabled={busy} type="email" name="email" />
  </label>

  <div>
    <label>
      <span>Password:</span>
      <input disabled={busy} type="password" name="password" />
    </label>
  </div>

  <div id="error"></div>

  <button type="submit">Login</button>
</form>
```

# React Example

```jsx
import { z } from "zod";
import { useState } from "react";
import { create, Message } from "./react";

export const Example = () => {
  const [message, setMessage] = useState<Message>({
    value: null,
    timestamp: Date.now(),
  });

  const [busy, setBusy] = useState(false);

  return (
    <form
      className="form"
      onSubmit={create({
        schema,
        onSubmit: fromServer,
        onError: setMessage,
        onBusy: setBusy,

        schema: z.object({
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
        }),
      })}
    >
      <label>
        <span>Email:</span>
        <input disabled={busy} type="email" name="email" />
      </label>

      <div>
        <label>
          <span>Password:</span>
          <input disabled={busy} type="password" name="password" />
        </label>
      </div>

      <div>
        {message.value && (
          <div className="message" key={`${message.value}-${message.timestamp}`}>
            {message.value}
          </div>
        )}
      </div>

      <button type="submit" disabled={busy}>
        {busy ? "Processing..." : "Login"}
      </button>
    </form>
  );
};
```
