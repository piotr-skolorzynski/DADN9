import { Routes } from '@angular/router';
import { authGuard, preventUnsavedChangesGuard } from '@core/guards';
import { NotFound, ServerError } from './shared';
import {
  Home,
  Lists,
  MemberDetailed,
  MemberList,
  MemberMessages,
  MemberPhotos,
  MemberProfile,
  Messages,
  TestErrors,
} from './features';
import { memberResolver } from '@core/resolvers';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemberList,
      },
      {
        path: 'members/:id',
        resolve: { member: memberResolver },
        runGuardsAndResolvers: 'always',
        component: MemberDetailed,
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            component: MemberProfile,
            title: 'Profile',
            canDeactivate: [preventUnsavedChangesGuard],
          },
          {
            path: 'photos',
            component: MemberPhotos,
            title: 'Photos',
          },
          {
            path: 'messages',
            component: MemberMessages,
            title: 'Messages',
          },
        ],
      },
      {
        path: 'lists',
        component: Lists,
      },
      {
        path: 'messages',
        component: Messages,
      },
    ],
  },
  {
    path: 'errors',
    component: TestErrors,
  },
  {
    path: 'server-error',
    component: ServerError,
  },
  {
    path: '**',
    component: NotFound,
  },
];
