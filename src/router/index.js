import Vue from 'vue'
import Router from 'vue-router'
// Pages
import LoginPage from '../pages/Login'
import AppIndex from '../pages/AppIndex'
import NotFoundPage from '../pages/NotFoundPage'
import Dashboard from '../pages/dashboard/Dashboard'

import { LiveModuleRouter } from './live';
import { GiftModuleRouter } from './gift';
import { SysModuleRouter } from './sys';
import { RechargeModuleRouter } from './recharge';
import { WithdrawModuleRouter } from './withdraw';
import { BasicDataModuleRouter } from './basic-data';
import { MusicModuleRouter } from './music';
import { G11nModuleRouter } from './g11n';
import { ImModuleRouter } from './im';
import { VideoModuleRouter } from './video';
import { UserModuleRouter } from './user';
import { FriendRingModuleRouter } from './friend';
import { MsgPushMoudleRouter } from './msgpush';
import { AuditModuleRouter } from './audit';
import { AssistantModuleRouter } from './assistant';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/',
      name: 'AppIndex',
      component: AppIndex,
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        GiftModuleRouter,
        SysModuleRouter,
        RechargeModuleRouter,
        WithdrawModuleRouter,
        BasicDataModuleRouter,
        MusicModuleRouter,
        G11nModuleRouter,
        ImModuleRouter,
        VideoModuleRouter,
        UserModuleRouter,
        LiveModuleRouter,
        FriendRingModuleRouter,
        MsgPushMoudleRouter,
        AuditModuleRouter,
        AssistantModuleRouter,
        {
          path: '*',
          name: 'NotFound',
          component: NotFoundPage
        }
      ]
    }
  ]
})
