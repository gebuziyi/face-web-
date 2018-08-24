// ============================================ Music module
import G11nHomePage from '../../pages/g11n/G11nHomePage.vue'
import G11nInfoPage from '../../pages/g11n/G11nInfoPage.vue'

export const G11nModuleRouter = {
  path: 'g11n',
  name: 'G11nHomePage',
  component: G11nHomePage,
  children: [
    {
      path: 'g11n-info',
      name: 'G11nInfoPage',
      component: G11nInfoPage
    }
  ]
}
