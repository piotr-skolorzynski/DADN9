import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.html',
  imports: [RouterLink],
})
export class MemberCard {
  public member = input.required<IMember>();
}
