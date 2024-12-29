import { z } from "zod";
import type { Schema } from "zod";
import type { FormEvent } from "react";

export type Message = {
  value: null | string;
  timestamp: number;
};

export type Handler = (event: SubmitEvent | FormEvent<HTMLFormElement>) => void;

export type Config<T extends Schema> = {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void | boolean | Error>;
  onError: HTMLElement | ((error: Message) => void);
  onBusy?: boolean | string | ((busy: boolean) => void);
};

export const create = <T extends Schema>(config: Config<T>): Handler => {
  const { onSubmit, schema, onError, onBusy } = config;

  return async (event: any) => {
    event.preventDefault();
    if (typeof onError === "function") {
      onError({ value: null, timestamp: Date.now() });
    } else {
      onError.innerHTML = "";
    }

    const form = event.currentTarget as any;
    const data = Object.fromEntries(new FormData(form) as any);

    const buttons = form.querySelectorAll("button");
    const inputs = form.querySelectorAll("input, textarea, select");
    const prevText = form.querySelector("button[type=submit]")?.textContent;

    try {
      const parsed = schema.parse(data);

      if (onBusy) {
        if (typeof onBusy === "function") {
          onBusy(true);
        } else {
          for (const button of buttons) {
            button.disabled = true;
          }

          for (const input of inputs) {
            input.disabled = true;
          }

          form.querySelector("button[type=submit]").textContent = onBusy;
        }
      }

      const response = await onSubmit(parsed);

      if (response) {
        event.preventDefault();

        if (response !== true) {
          const message = response instanceof Error ? response.message : response;

          if (typeof onError === "function") {
            onError({value: message, timestamp: Date.now()});
          } else {
            onError.innerHTML = `<p>${message}</p>`;
          }
        }

        if (onBusy) {
          if (typeof onBusy === "function") {
            onBusy(false);
          } else {
            for (const button of buttons) {
              button.disabled = false;
            }

            for (const input of inputs) {
              input.disabled = false;
            }

            form.querySelector("button[type=submit]").textContent = prevText;
          }
        }
      }
    } catch (error: any) {
      let message = error.message;

      if (error.errors.length) {
        form.querySelector(`[name="${error.errors[0].path[0]}"]`).focus();
        message = error.errors[0].message;
      } else {
        message = error.message;
      }

      if (typeof onError === "function") {
        onError({ value: message, timestamp: Date.now() });
      } else {
        onError.innerHTML = `<p>${message}</p>`;
      }
    }
  };
};

export const attach = (element: HTMLFormElement, handler: Handler) => {
  element.addEventListener("submit", handler);

  return {
    remove: () => element.removeEventListener("submit", handler),
  };
};
