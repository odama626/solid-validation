export function prepareFormDataForPocketbase(
  formData: FormData,
  form: HTMLFormElement,
) {
  form
    .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
    .forEach((input) => {
      if (!formData.has(input.name)) {
        formData.set(input.name, "false");
      }
    });
  return formData;
}

interface PocketbaseError extends Error {
  message: string;
  data: {
    data: Record<string, { message: string }>;
  };
}

export function parsePocketbaseError(e: PocketbaseError) {
  return {
    ...Object.fromEntries(
      Object.entries(e.data.data).map(([key, value]) => [key, value.message]),
    ),
    form: e.message,
  };
}
