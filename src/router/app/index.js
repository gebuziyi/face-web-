// ============================================ Instant message module
import AppHomePage from '../../pages/app/AppHomePage.vue'
import AppSplashScreen from '../../pages/app/AppSplashScreen.vue'
import AppActivityInfo from '../../pages/app/AppActivityInfo.vue'
import AppLikeImgInfo from '../../pages/app/AppLikeImgInfo.vue'
export const AppModuleRouter = {
  path: 'app',
  name: 'AppHomePage',
  component: AppHomePage,
  children: [
    {
      path: 'app-splash-screen',
      name: 'AppSplashScreen',
      component: AppSplashScreen
    },
    {
      path: 'app-activity-info',
      name: 'AppActivityInfo',
      component: AppActivityInfo
    },
    {
      path: 'app-like-img',
      name: 'AppLikeImgInfo',
      component: AppLikeImgInfo
    }
  ]
}
