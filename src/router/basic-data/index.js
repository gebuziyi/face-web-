// ============================================ Basic data module
import BasicDataHomePage from '../../pages/basic-data/BasicDataHomePage.vue'
import CountryInfoPage from '../../pages/basic-data/CountryInfoPage.vue'
import FeedbackInfoPage from '../../pages/basic-data/FeedbackInfoPage.vue'
import SearchKeyPage from '../../pages/basic-data/SearchKeyPage.vue'
import PayTypePage from '../../pages/basic-data/PayTypePage.vue'
import ReportTypePage from '../../pages/basic-data/ReportTypePage.vue'
import ReportInfoPage from '../../pages/basic-data/ReportInfoPage.vue'
import F2dNormPage from '../../pages/basic-data/F2dNormPage.vue'

export const BasicDataModuleRouter = {
  path: 'basic-data',
  name: 'BasicDataHomePage',
  component: BasicDataHomePage,
  children: [
    {
      path: 'country-info',
      name: 'CountryInfoPage',
      component: CountryInfoPage
    },
    {
      path: 'feedback-info',
      name: 'FeedbackInfoPage',
      component: FeedbackInfoPage
    },
    {
      path: 'search-key',
      name: 'SearchKeyPage',
      component: SearchKeyPage
    },
    {
      path: 'pay-type',
      name: 'PayTypePage',
      component: PayTypePage
    },
    {
      path: 'report-type',
      name: 'ReportTypePage',
      component: ReportTypePage
    },
    {
      path: 'report-info',
      name: 'ReportInfoPage',
      component: ReportInfoPage
    },
    {
      path: 'f2d',
      name: 'F2dNormPage',
      component: F2dNormPage
    }
  ]
}
