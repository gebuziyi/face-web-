// ============================================ Gift module
import GiftHomePage from '../../pages/gift/GiftHomePage'
import GiftInfoPage from '../../pages/gift/GiftInfoPage'
import GiftTypePage from '../../pages/gift/GiftTypePage'

export const GiftModuleRouter = {
  path: 'gift',
  name: 'GiftHomePage',
  component: GiftHomePage,
  children: [
    {
      path: 'gift-info',
      name: 'GiftInfoPage',
      component: GiftInfoPage
    },
    {
      path: 'gift-type',
      name: 'GiftTypePage',
      component: GiftTypePage
    }
  ]
}
