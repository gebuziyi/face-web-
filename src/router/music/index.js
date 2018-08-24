// ============================================ Music module
import MusicHomePage from '../../pages/music/MusicHomePage.vue'
import MusicTypePage from '../../pages/music/MusicTypePage.vue'
import MusicInfoPage from '../../pages/music/MusicInfoPage.vue'
import MusiclogPage from '../../pages/music/MusiclogPage.vue'

export const MusicModuleRouter = {
  path: 'music',
  name: 'MusicHomePage',
  component: MusicHomePage,
  children: [
    {
      path: 'music-type',
      name: 'MusicTypePage',
      component: MusicTypePage
    },
    {
      path: 'music-info',
      name: 'MusicInfoPage',
      component: MusicInfoPage
    },
    {
      path: 'music-log',
      name: 'MusiclogPage',
      component: MusiclogPage
    }
  ]
}
