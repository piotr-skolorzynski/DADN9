import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  templateUrl: './star-button.html',
})
export class StarButton {
  public disabled = input.required<boolean>();
  public selected = input.required<boolean>();
  public clickEvent = output<Event>();

  public onClick(event: Event): void {
    this.clickEvent.emit(event);
  }
}
