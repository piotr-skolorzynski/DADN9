import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { form, Field } from '@angular/forms/signals';
import { tap } from 'rxjs';
import { MemberService, ToastService } from '@core/services';
import { IEditableMember, IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.html',
  imports: [DatePipe, Field],
})
export class MemberProfile implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);
  private readonly toastService = inject(ToastService);
  protected isEditMode = this.memberService.isEditMode;
  protected member = signal<IMember | undefined>(undefined);
  protected readonly emptyEditableMember: IEditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  };
  protected readonly editableMemberData = signal<IEditableMember>(
    this.emptyEditableMember
  );
  public readonly form = form(this.editableMemberData);

  public ngOnInit(): void {
    this.initializeMemberData();
    this.initializeForm();
  }

  public ngOnDestroy(): void {
    if (this.isEditMode()) {
      this.memberService.setEditMode(false);
    }
  }

  private initializeMemberData(): void {
    this.route.parent?.data
      .pipe(tap(data => this.member.set(data['member'])))
      .subscribe();
  }

  private initializeForm(): void {
    this.editableMemberData.set({
      displayName: this.member()?.displayName ?? '',
      description: this.member()?.description ?? '',
      city: this.member()?.city ?? '',
      country: this.member()?.country ?? '',
    });
  }

  public updateProfile(): void {
    if (!this.member) {
      return;
    }
    const updatedMember = { ...this.member(), ...this.editableMemberData() };
    console.log('profile updated: ', updatedMember);
    this.toastService.success('Profile updated successfully');
    this.memberService.setEditMode(false);
  }

  @HostListener('window:beforeunload', ['$event'])
  public notify($event: BeforeUnloadEvent): void {
    if (this.form().dirty()) {
      $event.preventDefault();
    }
  }
}
