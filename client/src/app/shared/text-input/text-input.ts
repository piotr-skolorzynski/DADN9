import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.html',
})
export class TextInput implements FormValueControl<string> {
  public readonly label = input.required<string>();
  public readonly type = input<'text' | 'email' | 'password'>('text');
  public readonly hasError = input.required<boolean>();

  public readonly value = model<string>('');

  public onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
  }
}
