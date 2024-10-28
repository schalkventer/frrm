import { z, Schema, ZodError } from "zod";
import { FormEvent } from "react";

export type Message = {
  value: null | string;
  timestamp: number;
};

export const create = <T extends Schema>(config: {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void | string>;
  onError: (error: Message) => void;
  onBusy: (busy: boolean) => void;
}) => {
  const { onSubmit, schema, onError, onBusy } = config;

  return async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onError({ value: null, timestamp: Date.now() });
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const parsed = schema.parse(data);
      if (onBusy) onBusy(true);
      console.log(55555);
      const response = await onSubmit(parsed);
      console.log(444, response);
      if (response) onError({ value: response, timestamp: Date.now() });
      if (onBusy) onBusy(false);
    } catch (error) {
      if (error instanceof ZodError) {
        (
          form.querySelector(`[name="${error.errors[0].path[0]}"]`) as any
        ).focus();

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
