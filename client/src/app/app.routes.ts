import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';
import { Home, Lists, MemberDetailed, MemberList, Messages } from './features';

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
        component: MemberDetailed,
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
    path: '**',
    component: Home, //TODO: create notFoundPage
  },
];
