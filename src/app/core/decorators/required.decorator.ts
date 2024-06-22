import { FormArray, FormBuilder, ValidatorFn, FormControl } from '@angular/forms';

export function validateProps<T>(cmp: T, ruleset: {[key in keyof T]?: ValidatorFn[]} ) {
  const toGroup = {};
  Object.keys(ruleset)
    .forEach(key => toGroup[key] = new FormControl(cmp[key], ruleset[key]));
  const formGroup = new FormBuilder().group(toGroup);
  formGroup.updateValueAndValidity();
  const validationResult = {};
  Object.keys(formGroup.controls)
    .filter(key => formGroup.controls[key].errors)
    .forEach(key => validationResult[key] = formGroup.controls[key].errors);
  if (Object.keys(validationResult).length) {
    throw new Error(`Input validation failed:\n ${JSON.stringify(validationResult, null, 2)}`);
  }
}