import { Component, computed, inject, output, signal } from '@angular/core';
import {
  email,
  form,
  required,
  Field,
  minLength,
  maxLength,
  customError,
  validateTree,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { AccountService } from '@core/services';
import { IRegisterCredentials, IRegisterProfile } from '@models/interfaces';
import { TextInput } from '@shared/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [Field, JsonPipe, TextInput],
})
export class Register {
  public cancelRegister = output<boolean>();

  private readonly accountService = inject(AccountService);
  private readonly emptyRegisterCredentials: IRegisterCredentials = {
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  };
  private readonly emptyProfileData: IRegisterProfile = {
    gender: '',
    dateOfBirth: '',
    city: '',
    country: '',
  };
  private readonly creds = signal<IRegisterCredentials>(
    this.emptyRegisterCredentials
  );
  private readonly profile = signal<IRegisterProfile>(this.emptyProfileData);

  protected readonly credentialsForm = form(this.creds, schema => {
    required(schema.email, {
      message: 'Your Email is required!',
    });
    email(schema.email, {
      message: 'Please enter a valid email address!',
    });
    required(schema.displayName, {
      message: 'Your name is required!',
    });
    required(schema.password, {
      message: 'Your password is required!',
    });
    minLength(schema.password, 4);
    maxLength(schema.password, 8);
    required(schema.confirmPassword, {
      message: 'Please Confirm your password',
    });
    validateTree(schema, ctx => {
      const password = ctx.valueOf(schema.password);
      const confirmPassword = ctx.valueOf(schema.confirmPassword);

      return password === confirmPassword
        ? undefined
        : [
            customError({
              field: ctx.fieldTreeOf(schema.password),
              message: 'Passwords do not match',
              kind: 'passwordMismatch',
            }),
            customError({
              field: ctx.fieldTreeOf(schema.confirmPassword),
              message: 'Passwords do not match',
              kind: 'passwordMismatch',
            }),
          ];
    });
  });

  protected readonly profileForm = form(this.profile, schema => {
    required(schema.gender, { message: 'Your gender is required' });
    required(schema.dateOfBirth, { message: 'Your date of birth is required' });
    required(schema.city, { message: 'Your city is required' });
    required(schema.country, { message: 'Your country is required' });
  });
  protected currentStep = signal(1);

  //TODO: move error into input when props like touched, errors will work inside input using FormValueControl

  protected hasEmailError = computed(
    () =>
      this.credentialsForm.email().errors().length > 0 &&
      this.credentialsForm.email().dirty()
  );

  protected hasDisplayNameError = computed(
    () =>
      this.credentialsForm.displayName().errors().length > 0 &&
      this.credentialsForm.displayName().dirty()
  );

  protected hasPasswordError = computed(
    () =>
      this.credentialsForm.password().errors().length > 0 &&
      this.credentialsForm.password().dirty()
  );

  protected hasConfirmPasswordError = computed(
    () =>
      this.credentialsForm.confirmPassword().errors().length > 0 &&
      this.credentialsForm.confirmPassword().dirty()
  );

  protected hasGenderError = computed(
    () =>
      this.credentialsForm.confirmPassword().errors().length > 0 &&
      this.credentialsForm.confirmPassword().dirty()
  );

  protected hasDateOfBirthError = computed(
    () =>
      this.credentialsForm.confirmPassword().errors().length > 0 &&
      this.credentialsForm.confirmPassword().dirty()
  );

  protected hasCityError = computed(
    () =>
      this.credentialsForm.confirmPassword().errors().length > 0 &&
      this.credentialsForm.confirmPassword().dirty()
  );

  protected hasCountryError = computed(
    () =>
      this.credentialsForm.confirmPassword().errors().length > 0 &&
      this.credentialsForm.confirmPassword().dirty()
  );

  public register(): void {
    if (this.credentialsForm().value() && this.profileForm().value()) {
      const formData = {
        ...this.credentialsForm().value(),
        ...this.profileForm().value(),
      };
      console.log('formData: ', formData);
    }
    // this.accountService
    //   .register(this.creds())
    //   .pipe(
    //     tap(response => {
    //       console.log(response);
    //       this.cancel();
    //     }),
    //     catchError(error => {
    //       console.log(error.message);
    //       return of();
    //     })
    //   )
    //   .subscribe({});
  }

  public prevStep(): void {
    this.currentStep.update(prevStep => prevStep - 1);
  }

  public nextStep(): void {
    if (this.credentialsForm().valid()) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

  public getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);

    return today.toISOString().split('T')[0];
  }
}
