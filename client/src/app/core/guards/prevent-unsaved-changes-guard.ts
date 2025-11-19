import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '@features/index';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (
  component,
  _1,
  _2,
  _3
) => {
  if (component.form().dirty()) {
    return confirm(
      'Are you sure you want to continue? All unsaved changes will be lost'
    );
  }

  return true;
};
