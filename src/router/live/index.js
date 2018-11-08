// ============================================ Live module
const LiveHomePage = () => import('../../pages/live/LiveHomePage.vue')
const LiveTypePage = () => import('../../pages/live/LiveTypePage.vue')
const LiveHomeInfoPage = () => import('../../pages/live/LiveHomeInfoPage.vue')
const LiveInfoPage = () => import('../../pages/live/LiveInfoPage.vue')
const LiveGiftSendPage = () => import('../../pages/live/LiveGiftSendPage.vue')
const LiveConsolePage = () => import('../../pages/live/LiveConsole.vue')
const AnchorWorkLogPage = () => import('../../pages/live/AnchorWorkLogPage.vue')
const AnchorInfoPage = () => import('../../pages/live/AnchorInfoPage.vue')
const LiveTapeFile = () => import('../../pages/live/LiveTapeFile.vue')
const LiveEnterEffect = () => import('../../pages/live/LiveEnterEffect.vue')

export const LiveModuleRouter = {
  path: '/live',
  name: 'LiveHomePage',
  component: LiveHomePage,
  children: [
    {
      path: 'live-type',
      name: 'LiveTypePage',
      component: LiveTypePage
    },
    {
      path: 'live-home',
      name: 'LiveHomeInfoPage',
      component: LiveHomeInfoPage
    },
    {
      path: 'live-info',
      name: 'LiveInfoPage',
      component: LiveInfoPage
    },
    {
      path: 'live-gift-send',
      name: 'LiveGiftSendPage',
      component: LiveGiftSendPage
    },
    {
      path: 'live-console',
      name: 'LiveConsolePage',
      component: LiveConsolePage
    },
    {
      path: 'work-log',
      name: 'AnchorWorkLogPage',
      component: AnchorWorkLogPage
    },
    {
      path: 'anchor-info',
      name: 'AnchorInfoPage',
      component: AnchorInfoPage
    },
    {
      path: 'tape-file',
      name: 'LiveTapeFile',
      component: LiveTapeFile
    },
    {
      path: 'enter-effect',
      name: 'LiveEnterEffect',
      component: LiveEnterEffect
    }
  ]
}
