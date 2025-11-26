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
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { AccountService } from '@core/services';
import {
  ICombinedCredentialForms,
  IRegisterCredentialsForm,
  IRegisterProfile,
} from '@models/interfaces';
import { TextInput } from '@shared/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [Field, TextInput],
})
export class Register {
  public cancelRegister = output<boolean>();

  protected validationErrors = signal<string[]>([]);

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly emptyRegisterCredentials: IRegisterCredentialsForm = {
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  };
  private readonly emptyProfileData: IRegisterProfile = {
    gender: 'male',
    dateOfBirth: '',
    city: '',
    country: '',
  };
  private readonly creds = signal<IRegisterCredentialsForm>(
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
      this.profileForm.gender().errors().length > 0 &&
      this.profileForm.gender().dirty()
  );

  protected hasDateOfBirthError = computed(
    () =>
      this.profileForm.dateOfBirth().errors().length > 0 &&
      this.profileForm.dateOfBirth().dirty()
  );

  protected hasCityError = computed(
    () =>
      this.profileForm.city().errors().length > 0 &&
      this.profileForm.city().dirty()
  );

  protected hasCountryError = computed(
    () =>
      this.profileForm.country().errors().length > 0 &&
      this.profileForm.country().dirty()
  );

  public register(): void {
    if (this.credentialsForm().value() && this.profileForm().value()) {
      const formData: ICombinedCredentialForms = {
        ...this.credentialsForm().value(),
        ...this.profileForm().value(),
      };

      delete formData.confirmPassword;

      this.accountService
        .register(formData)
        .pipe(
          tap(() => {
            this.router.navigateByUrl('/members');
            this.cancel();
          }),
          catchError(error => {
            console.log(error);
            this.validationErrors.set(error);

            return EMPTY;
          })
        )
        .subscribe();
    }
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
