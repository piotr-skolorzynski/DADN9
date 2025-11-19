import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgePipe } from '@core/pipes';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.html',
  imports: [AgePipe, RouterLink],
})
export class MemberCard {
  public member = input.required<IMember>();
}
