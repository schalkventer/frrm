import { create, attach } from "./frrm";
import { z } from "zod";

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
      try {
        setTimeout(() => {
          if (submission.email !== "john@example.com")
            resolve(Error("Invalid email"));

          if (submission.password !== "hunter2")
            resolve(Error("Invalid password"));

          resolve(undefined);
        }, 4000);
      } catch (error) {
        console.error(error);
        resolve(Error("Something went wrong"));
      }
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
