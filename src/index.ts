import { z, Schema, ZodError } from "zod";

export const create = <T extends Schema>(config: {
  node: HTMLFormElement;
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void | string>;
  onError: (error: { message: null | string; timestamp: number }) => void;
}): { remove: () => void } => {
  const { node, onSubmit, schema, onError } = config;

  const fn = async (event: SubmitEvent) => {
    event.preventDefault();
    onError({ message: null, timestamp: Date.now() });
    const form = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(form);
    try {
      const parsed = schema.parse(data);
      const response = await onSubmit(parsed);
      if (response) onError({ message: response, timestamp: Date.now() });
    } catch (error) {
      if (error instanceof ZodError) {
        return onError({
          message: error.errors[0].message,
          timestamp: Date.now(),
        });
      }

      throw error;
    }
  };

  node.addEventListener("submit", fn);

  return {
    remove: () => node.removeEventListener("submit", fn),
  };
};
