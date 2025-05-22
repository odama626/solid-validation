export function prepareFormDataForPocketbase(formData: FormData, form: HTMLFormElement) {
  form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(input => {
    if (!formData.has(input.name)) {
      formData.set(input.name, 'false');
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

function isPocketbaseFieldError(e: any): e is PocketbaseError {
  return e?.data?.data && typeof e?.data?.data === 'object';
}

export function parsePocketbaseError(e: Error, rootErrorKey = 'form') {
  let result = {
    [rootErrorKey]: e.message,
  };
  if (isPocketbaseFieldError(e)) {
    Object.assign(
      result,
      Object.fromEntries(Object.entries(e.data.data).map(([key, value]) => [key, value.message]))
    );
  }
  return result;
}
