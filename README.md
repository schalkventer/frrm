<!-- omit in toc -->
# 🐇 frrm

[![](https://img.shields.io/npm/v/frrm)](https://www.npmjs.com/package/frrm)
[![](https://img.shields.io/github/stars/schalkventer/frrm?style=social)](https://github.com/schalkventer/frrm)

**Tiny 0.5kb Zod-based, HTML form abstraction that goes brr.**  

_⭐ If you find this tool useful please consider giving it a star on Github ⭐_

<img
src="https://github.com/user-attachments/assets/7523e907-893a-4540-bc8a-b6800fb8c566"
width="500">

- [Basic Example](#basic-example)
  - [JavaScript](#javascript)
  - [CSS](#css)
  - [HTML](#html)
- [React Example](#react-example)
- [Is it really 0.5kb?](#is-it-really-05kb)

# Basic Example

## JavaScript

```ts
import { create, attach } from 'frrm'
import { z } from 'zod'

const handler = create({
  /**
   * If string value then will replace submit button text with provided value
   * while server request is resolving. Will also disable all buttons and
   * inputs. If `true` is passed the label wont be replaced, but everything will
   * still disable. Alternatively you can pass a callback if you want to
   * manually handle the busy state (will prevent default behaviour).
   */
  onBusy: "Loading...",

  /**
   * Applies client-side Zod validation to determine whether `onSubmit` should
   * fire.
   */
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

  /**
   * Will inject error message into the provided DOM element. Alternatively a
   * callback can be provided that accepts both `timestamp` and `value`
   * properties. Note that error is automatically removed when the form is
   * submitted again - likewise a `null` value will be passed to the callback
   * (if used).
   */
  onError: document.querySelector('[role="alert"]')!,

  onSubmit: (submission) => {
    /**
     * Fake server request that takes 4 seconds to resolve, and throws on
     * incorrect email or password.
     */
    return new Promise((resolve) => {
      setTimeout(() => {
        if (submission.email !== "john@example.com")
          throw new Error("Invalid email");
        if (submission.password !== "hunter2")
          throw new Error("Invalid password");
        resolve(undefined);
      }, 4000);
    });
  },
});

/**
 * If you are using a framework like React, then you can simply pass the
 * instance to the onSubmit handler. However, if you are using plain JavaScript,
 * then you need to attach the event listener manually. You can use the `attach`
 * function to do this if you want, since it provides a returned object with a
 * `remove` method for cleanup.
 */
attach(document.querySelector("form")!, handler);

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

form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

[role="alert"] > * {
  background: rgba(255, 0, 0, 0.05);
  padding: 1rem;
  animation: enter 0.3s ease;
}
```

## HTML

```html
<form>
  <label>
    <span>Email:</span>
    <input type="email" name="email" />
  </label>

  <div>
    <label>
      <span>Password:</span>
      <input type="password" name="password" />
    </label>
  </div>

  <div role="alert" aria-live="assertive"></div>
  <button type="submit">Login</button>
</form>
```

# React Example

When using React you can simply pass the handler as is to `onSubmit`.

```jsx
import { z } from "zod";
import { useState } from "react";
import { create } from "./react";

export const Example = () => {
  const [message, setMessage] = useState({
    value: null,
    timestamp: Date.now(),
  });

  return (
    <form
      className="form"
      onSubmit={create({
        schema,
        onSubmit: fromServer,
        onError: setMessage,
        onBusy: "Loading...",

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
        <input type="email" name="email" />
      </label>

      <div>
        <label>
          <span>Password:</span>
          <input type="password" name="password" />
        </label>
      </div>

      <div>
        {message.value && (
          <div className="message" key={`${message.value}-${message.timestamp}`}>
            {message.value}
          </div>
        )}
      </div>

      <button type="submit">
        Login
      </button>
    </form>
  );
};
```

# Is it really 0.5kb?

Pretty much. Technically it is ~0.537kb . This is the minified code:

```js
const e=e=>{const{onSubmit:t,schema:r,onError:a}=e;return async e=>{e.preventDefault(),a({value:null,timestamp:Date.now()});const n=e.currentTarget,o=Object.fromEntries(new FormData(n));try{const e=r.parse(o),n=await t(e);n&&a({value:n,timestamp:Date.now()})}catch(e){if(e.errors.length)return n.querySelector(`[name="${e.errors[0].path[0]}"]`).focus(),a({value:e.errors[0].message,timestamp:Date.now()});throw e}}},t=(e,t)=>(e.addEventListener("submit",t),{remove:()=>e.removeEventListener("submit",t)});export{t as attach,e as create};
```
