// ============================================ QA module
import QaHomePage from '../../pages/qa/QaHomePage'
import QaTypePage from '../../pages/qa/QaTypePage'
import QaInfoPage from '../../pages/qa/QaInfoPage'
import QaLikePage from '../../pages/qa/QaLikePage'
import QaMakePage from '../../pages/qa/QaMakePage'
import QaReplyLikePage from '../../pages/qa/QaReplyLikePage'
import QaReplyMakePage from '../../pages/qa/QaReplyMakePage'
import QaPayLogPage from '../../pages/qa/QaPayLogPage'
import QaReplyPage from '../../pages/qa/QaReplyPage'
import QaViewPage from '../../pages/qa/QaViewPage'
import QaRewardMoneyPage from '../../pages/qa/QaRewardMoneyPage'
import QaRecommendPage from '../../pages/qa/QaRecommendPage'
import QaSetDaysPage from '../../pages/qa/QaSetDaysPage'
import QaAmountSetPage from '../../pages/qa/QaAmountSetPage'

export const QaMoudleRouter = {
  path: 'qa',
  name: 'QaHomePage',
  component: QaHomePage,
  children: [
    {
      path: 'qa-type',
      name: 'QaTypePage',
      component: QaTypePage
    },
    {
      path: 'qa-info',
      name: 'QaInfoPage',
      component: QaInfoPage
    },
    {
      path: 'qa-like',
      name: 'QaLikePage',
      component: QaLikePage
    },
    {
      path: 'qa-make',
      name: 'QaMakePage',
      component: QaMakePage
    },
    {
      path: 'qa-reply-like',
      name: 'QaReplyLikePage',
      component: QaReplyLikePage
    },
    {
      path: 'qa-reply-make',
      name: 'QaReplyMakePage',
      component: QaReplyMakePage
    },
    {
      path: 'qa-pay-log',
      name: 'QaPayLogPage',
      component: QaPayLogPage
    },
    {
      path: 'qa-reply',
      name: 'QaReplyPage',
      component: QaReplyPage
    },
    {
      path: 'qa-view',
      name: 'QaViewPage',
      component: QaViewPage
    },
    {
      path: 'qa-reward-money',
      name: 'QaRewardMoneyPage',
      component: QaRewardMoneyPage
    },
    {
      path: 'qa-recommend',
      name: 'QaRecommendPage',
      component: QaRecommendPage
    },
    {
      path: 'qa-set-days',
      name: 'QaSetDaysPage',
      component: QaSetDaysPage
    },
    {
      path: 'qa-amount-set',
      name: 'QaAmountSetPage',
      component: QaAmountSetPage
    }
  ]
}
