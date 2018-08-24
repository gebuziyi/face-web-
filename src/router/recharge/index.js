// ============================================ Recharge module
const RechargeHomePage = () => import('../../pages/recharge/RechargeHomePage.vue');
const RechargeNormPage = () => import('../../pages/recharge/RechargeNormPage.vue');
const RechargeLogPage = () => import('../../pages/recharge/RechargeLogPage.vue');
const RechargeOrderPage = () => import('../../pages/recharge/RechargeOrderPage.vue');
const RechargeActivityPage = () => import('../../pages/recharge/RechargeActivityPage.vue');

export const RechargeModuleRouter = {
  path: 'recharge',
  name: 'RechargeHomePage',
  component: RechargeHomePage,
  children: [
    {
      path: 'recharge-norm',
      name: 'RechargeNormPage',
      component: RechargeNormPage
    },
    {
      path: 'recharge-log',
      name: 'RechargeLogPage',
      component: RechargeLogPage
    },
    {
      path: 'recharge-order',
      name: 'RechargeOrderPage',
      component: RechargeOrderPage
    },
    {
      path: 'recharge-activity',
      name: 'RechargeActivityPage',
      component: RechargeActivityPage
    }
  ]
}
