import { z } from "zod";
import { useState } from "react";
import { create, Message } from "./react";

const fromServer = (submission: {
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

      {message.value && (
        <div className="message" key={`${message.value}-${message.timestamp}`}>
          {message.value}
        </div>
      )}

      <button type="submit" disabled={busy}>
        {busy ? "Processing..." : "Login"}
      </button>
    </form>
  );
};
