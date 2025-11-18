import { Component, input } from '@angular/core';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.html',
})
export class MemberCard {
  public member = input.required<IMember>();
}
