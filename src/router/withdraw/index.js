// ============================================ Withdraw module
import WithdrawHomePage from '../../pages/withdraw/WithdrawHomePage.vue'
import WithdrawLogPage from '../../pages/withdraw/WithdrawLogPage.vue'
import WithdrawApplicationPage from '../../pages/withdraw/WithdrawApplicationPage.vue'
import WithdrawNormPage from '../../pages/withdraw/WithdrawNormPage.vue'

export const WithdrawModuleRouter = {
  path: 'withdraw',
  name: 'WithdrawHomePage',
  component: WithdrawHomePage,
  children: [
    {
      path: 'withdraw-log',
      name: 'WithdrawLogPage',
      component: WithdrawLogPage
    },
    {
      path: 'withdraw-application',
      name: 'WithdrawApplicationPage',
      component: WithdrawApplicationPage
    },
    {
      path: 'withdraw-norm',
      name: 'WithdrawNormPage',
      component: WithdrawNormPage
    }
  ]
}
