# Changelog

All notable changes to `@sparkstone/solid-validation` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [1.5.2] - 2026-06-04
- `submit` payload is now optional since it is only expected to be used by `formSubmit`
- enhanced documentation 

## [1.5.1] - 2026-05-06

### Fixed
- `isSubmitting` now remains true until after `isSubmitted` has been updated ([371820c](https://github.com/odama626/solid-validation/commit/371820c))

---

## [1.5.0] - 2025-06-09

### Added
- Validation can now be used without a `<form>` element by calling the `submit()` function directly
- `use:validate` can now be applied to any HTML element, not just inputs — non-input elements must provide a `data-name` attribute for error tracking

### Changed
- When validation fails, the failing element is now scrolled into view (in addition to focused), to support elements that don't natively support `.focus()`

---

## [1.4.0] - 2025-02-21

### Added
- `Validator` type is now exported from the package

### Changed
- Falsy values (e.g. `false`, `null`, `undefined`) are now allowed as entries in the validators array passed to `validate` and `validateRef`, enabling patterns like `condition && myValidator`

### Fixed
- Added safety guards around `parsePocketbaseError` to handle edge cases more gracefully

---

## [1.3.0] - 2025-02-21

### Fixed
- Custom validators used with `validate` or `validateRef` now work correctly on elements that don't support `validationMessage` and `setCustomValidity` in the DOM

---

## [1.2.0] - 2025-02-20

### Added
- `validateField(fieldName)` — validate an individual field by name for special use cases
- `getFieldValue(fieldName)` — retrieve the current value of an individual field

---

## [1.0.0] - 2025-02-13

### Added
- Initial release of `@sparkstone/solid-validation`
- `useForm()` composable providing a validation context for Solid.js
- `use:validate` directive for registering form inputs with optional custom validator functions
- `use:formSubmit` directive for handling form submission with integrated validation
- `errors` reactive store exposing validation error messages keyed by field name
- `isSubmitting()` and `isSubmitted()` reactive signals
- PocketBase integration via `@sparkstone/solid-validation/pocketbase`
  - `prepareFormDataForPocketbase(formData, form)` — ensures unchecked checkboxes are included in submissions
  - `parsePocketbaseError(error, rootErrorKey?)` — maps PocketBase API errors to field-level messages
- TypeScript types exposed in package exports
