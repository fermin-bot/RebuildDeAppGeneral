import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static noSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && typeof value === 'string' && value.includes(' ')) {
        return { noSpaces: true };
      }
      return null;
    };
  }

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
}
