import { describe, expect, it } from 'vitest';
import { parsePocketbaseError, prepareFormDataForPocketbase } from '../src/pocketbase';

function formWith(html: string) {
  const form = document.createElement('form');
  form.innerHTML = html;
  document.body.append(form);
  return form;
}

describe('prepareFormDataForPocketbase', () => {
  it('writes an explicit false for unchecked boxes', () => {
    const form = formWith(`<input type="checkbox" name="subscribed" />`);
    const result = prepareFormDataForPocketbase(new FormData(form), form);

    expect(result.get('subscribed')).toBe('false');
  });

  it('leaves a checked box alone', () => {
    const form = formWith(`<input type="checkbox" name="subscribed" value="on" checked />`);
    const result = prepareFormDataForPocketbase(new FormData(form), form);

    expect(result.get('subscribed')).toBe('on');
  });

  it('ignores non-checkbox inputs', () => {
    const form = formWith(`<input type="text" name="username" value="ada" />`);
    const result = prepareFormDataForPocketbase(new FormData(form), form);

    expect(result.get('username')).toBe('ada');
    expect([...result.keys()]).toEqual(['username']);
  });

  it('handles several checkboxes independently', () => {
    const form = formWith(`
      <input type="checkbox" name="a" checked />
      <input type="checkbox" name="b" />
    `);
    const result = prepareFormDataForPocketbase(new FormData(form), form);

    expect(result.get('a')).toBe('on');
    expect(result.get('b')).toBe('false');
  });

  it('returns the same FormData instance', () => {
    const form = formWith(`<input type="checkbox" name="a" />`);
    const formData = new FormData(form);

    expect(prepareFormDataForPocketbase(formData, form)).toBe(formData);
  });
});

describe('parsePocketbaseError', () => {
  it('flattens field errors into a name-keyed object', () => {
    const error = Object.assign(new Error('Failed to create record.'), {
      data: {
        data: {
          email: { message: 'Invalid email address' },
          password: { message: 'Too short' },
        },
      },
    });

    expect(parsePocketbaseError(error)).toEqual({
      form: 'Failed to create record.',
      email: 'Invalid email address',
      password: 'Too short',
    });
  });

  it('falls back to the root key for an error with no field data', () => {
    expect(parsePocketbaseError(new Error('Network request failed'))).toEqual({
      form: 'Network request failed',
    });
  });

  it('honours a custom root key', () => {
    const result = parsePocketbaseError(new Error('Something broke'), 'signupError');

    expect(result).toEqual({ signupError: 'Something broke' });
  });

  it('keeps the root message alongside field errors', () => {
    const error = Object.assign(new Error('Failed to create record.'), {
      data: { data: { email: { message: 'Invalid email address' } } },
    });

    expect(parsePocketbaseError(error, 'root').root).toBe('Failed to create record.');
  });
});
