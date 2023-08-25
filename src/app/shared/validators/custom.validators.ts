import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Custom validator functions for reactive form validation
 */
export class CustomValidators {
    /**
     * Validates that child controls in the form group are equal
     */
    //  export const identityRevealedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    //   const name = control.get('name');
    //   const alterEgo = control.get('alterEgo');

    //   return name && alterEgo && name.value === alterEgo.value ? { identityRevealed: true } : null;
    // };
    // export const childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
    //     const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
    //     const isValid = otherControlNames.every(controlName => formGroup.controls[controlName].value === formGroup.controls[firstControlName].value);
    //     return isValid ? null : { childrenNotEqual: true };
    // }

    //  static samePasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    //   const password = control.get('password');
    //   const passwordConfirm = control.get('passwordConfirm');
    //   return password && passwordConfirm && password.value === passwordConfirm.value ? { samePassword: true } : null;
    // };
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// /**
//  * Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
//  */
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
//     isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//         return control.invalid && control.touched;
//     }
// }

/**
* Collection of reusable RegExps
*/
export const regExps1: { [key: string]: RegExp } = {
  /*
  At least one digit [0-9]
  At least one lowercase character [a-z]
  At least one uppercase character [A-Z]
  At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
  At least 8 characters in length, but no more than 32.
  */
  //  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
   password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}:;<>,.?/~_+-=|]).{8,32}$/,
   numeric: /[0-9]/
};

export const StoryPointsSet:number[] = [1, 2, 3, 5, 8, 13];
export const PrioritySet:string[] = ['1', '2', '3'];

export const regExps = {
  /*
  At least one digit [0-9]
  At least one lowercase character [a-z]
  At least one uppercase character [A-Z]
  At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
  At least 8 characters in length, but no more than 32.
  */
  //  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
   password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}:;<>,.?/~_+-=|]).{8,32}$/,
   numeric: /[0-9]/
};
/**
 * Collection of reusable error messages
 */
export const errorMessages: { [key: string]: string } = {
  passwordConfirmedRequired: 'Password confirmation is <strong>required</strong>',
  samePassword: 'Passwords must match',
  emailInvalid: 'Please enter a valid email address',
  passwordRequired: 'Password is <strong>required</strong>',
  passwordInvalid: 'Password must be between 8 and 16 characters, and contain at least one number and special character',
  EmailRequired: 'Email is <strong>required</strong>',
  fullName: 'Full name must be between 1 and 128 characters',
  email: 'Firstname is required',
  firsnname: 'Firstname is required',
  lastname: 'Lastname is required',
  usernmae: 'Username is required',
  role: 'Role is required',
  status: 'Status is required',
  team: 'Role is required',
  project: 'Role is required',

};
