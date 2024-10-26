import { z } from "zod";
import type { Schema } from "zod";
import type { FormEvent } from "react";

export type Message = {
  value: null | string;
  timestamp: number;
};

export type Handler = (event: SubmitEvent | FormEvent<HTMLFormElement>) => void;

export const create = <T extends Schema>(config: {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void | string>;
  onError: (error: Message) => void;
}): Handler => {
  const { onSubmit, schema, onError } = config;

  return async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onError({ value: null, timestamp: Date.now() });

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const parsed = schema.parse(data);
      const response = await onSubmit(parsed);
      if (response) onError({ value: response, timestamp: Date.now() });
    } catch (error) {
      if (error.errors.length) {
        form.querySelector(`[name="${error.errors[0].path[0]}"]`).focus();
        error.errors[0].path[0];

        return onError({
          value: error.errors[0].message,
          timestamp: Date.now(),
        });
      }

      throw error;
    }
  };
};

export const attach = (element: HTMLFormElement, handler: Handler) => {
  element.addEventListener("submit", handler);

  return {
    remove: () => element.removeEventListener("submit", handler),
  };
};
