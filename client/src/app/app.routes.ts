import { Routes } from '@angular/router';
import { Home, Lists, MemberDetailed, MemberList, Messages } from './features';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
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
  {
    path: '**',
    component: Home, //TODO: create notFoundPage
  },
];
