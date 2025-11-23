import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.html',
})
export class DeleteButton {
  public disabled = input.required<boolean>();
  public clickEvent = output<Event>();

  public onClick(event: Event): void {
    this.clickEvent.emit(event);
  }
}
