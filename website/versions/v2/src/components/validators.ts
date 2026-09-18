import type { Validator } from '@sparkstone/solid-validation';

export const minLength =
  (min: number): Validator<HTMLInputElement> =>
  el =>
    el.value.length < min && `Use at least ${min} characters`;

export const noSpaces: Validator<HTMLInputElement> = el =>
  el.value.includes(' ') && 'Spaces are not allowed';

const taken = ['ada', 'grace', 'alan'];

/** Stands in for a network call, latency included. */
export const isUsernameAvailable: Validator<HTMLInputElement> = async el => {
  const value = el.value.toLowerCase();
  await new Promise(resolve => setTimeout(resolve, 600));
  return taken.includes(value) ? `${el.value} is already taken` : undefined;
};

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
