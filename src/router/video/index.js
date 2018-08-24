// ============================================ Video module
const VideoHomePage = () => import('../../pages/video/VideoHomePage.vue');
const VideoTypePage = () => import('../../pages/video/VideoTypePage.vue');
const VideoTopicPage = () => import('../../pages/video/VideoTopicPage.vue');
const VideoPlayLogPage = () => import('../../pages/video/VideoPlayLogPage.vue');
const VideoLikeLogPage = () => import('../../pages/video/VideoLikeLogPage.vue');
const VideoInfoPage = () => import('../../pages/video/VideoInfoPage.vue');
const VideoCommentPage = () => import('../../pages/video/VideoCommentPage.vue');
const VideoGiftSendPage = () => import('../../pages/video/VideoGiftSendPage.vue');

export const VideoModuleRouter = {
  path: 'video',
  name: 'VideoHomePage',
  component: VideoHomePage,
  children: [
    {
      path: 'video-type',
      name: 'VideoTypePage',
      component: VideoTypePage
    },
    {
      path: 'video-topic',
      name: 'VideoTopicPage',
      component: VideoTopicPage
    },
    {
      path: 'video-play-log',
      name: 'VideoPlayLogPage',
      component: VideoPlayLogPage
    },
    {
      path: 'video-like-log',
      name: 'VideoLikeLogPage',
      component: VideoLikeLogPage
    },
    {
      path: 'video-info',
      name: 'VideoInfoPage',
      component: VideoInfoPage
    },
    {
      path: 'video-comment',
      name: 'VideoCommentPage',
      component: VideoCommentPage
    },
    {
      path: 'video-gift-send',
      name: 'VideoGiftSendPage',
      component: VideoGiftSendPage
    }
  ]
}
