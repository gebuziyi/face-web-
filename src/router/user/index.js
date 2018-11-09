// ============================================ User module
const UserHomePage = () => import('../../pages/user/UserHomePage.vue');
const HobbyInfoPage = () => import('../../pages/user/HobbyInfoPage.vue');
const UserLevelPage = () => import('../../pages/user/UserLevelPage.vue');
const UserPage = () => import('../../pages/user/UserPage.vue');
const AnchorApplyPage = () => import('../../pages/user/AnchorApplyPage.vue');
const UserApprovePage = () => import('../../pages/user/UserApprovePage.vue');
const UserGiftInfoPage = () => import('../../pages/user/UserGiftInfoPage.vue');
const UserGiftExchangeLogPage = () => import('../../pages/user/UserGiftExchangeLogPage.vue');
const EmotionInfoTagsPage = () => import('../../pages/user/EmotionInfoTagsPage.vue');
const MakeFriendIntentionTagPage = () => import('../../pages/user/MakeFriendIntentionTagPage.vue');
const JobInfoPage = () => import('../../pages/user/JobInfoPage.vue');
const UserGiveAwayLogPage = () => import('../../pages/user/UserGiveAwayLogPage.vue');
const UserRecommendPage = () => import('../../pages/user/UserRecommendPage.vue');
const UserRecommendTypePage = () => import('../../pages/user/UserRecommendTypePage.vue');
const UserFreezeTypePage = () => import('../../pages/user/UserFreezeTypePage.vue');
const UserFreezeLogPage = () => import('../../pages/user/UserFreezelog.vue');
const InviteRecord = () => import('../../pages/user/InviteRecord.vue');
const UserAvatarAccessoryPage = () => import('../../pages/user/UserAvatarAccessoryPage.vue');
const AvatarAccessoryInfo = () => import('../../pages/user/AvatarAccessoryInfo.vue');
const UserLiveEnterEffectPage = () => import('../../pages/user/UserLiveEnterEffectPage.vue');

export const UserModuleRouter = {
  path: 'user',
  name: 'UserHomePage',
  component: UserHomePage,
  children: [
    {
      path: 'user-level',
      name: 'UserLevelPage',
      component: UserLevelPage
    },
    {
      path: 'hobby-info',
      name: 'HobbyInfoPage',
      component: HobbyInfoPage
    },
    {
      path: 'user-info',
      name: 'UserPage',
      component: UserPage
    },
    {
      path: 'anchor-apply',
      name: 'AnchorApplyPage',
      component: AnchorApplyPage
    },
    {
      path: 'user-approve',
      name: 'UserApprovePage',
      component: UserApprovePage
    },
    {
      path: 'user-gift',
      name: 'UserGiftInfoPage',
      component: UserGiftInfoPage
    },
    {
      path: 'gift-exchange-log',
      name: 'UserGiftExchangeLogPage',
      component: UserGiftExchangeLogPage
    },
    {
      path: 'emotion-tags',
      name: 'EmotionInfoTagsPage',
      component: EmotionInfoTagsPage
    },
    {
      path: 'friend-intention-tag',
      name: 'MakeFriendIntentionTagPage',
      component: MakeFriendIntentionTagPage
    },
    {
      path: 'job-info',
      name: 'JobInfoPage',
      component: JobInfoPage
    },
    {
      path: 'giveaway-log',
      name: 'UserGiveAwayLogPage',
      component: UserGiveAwayLogPage
    },
    {
      path: 'user-recommend',
      name: 'UserRecommendPage',
      component: UserRecommendPage
    },
    {
      path: 'user-recommend-type',
      name: 'UserRecommendTypePage',
      component: UserRecommendTypePage
    },
    {
      path: 'user-freeze-type',
      name: 'UserFreezeTypePage',
      component: UserFreezeTypePage
    },
    {
      path: 'freeze-log',
      name: 'UserFreezeLogPage',
      component: UserFreezeLogPage
    },
    {
      path: 'invite-record',
      name: 'InviteRecord',
      component: InviteRecord
    },
    {
      path: 'avatar-accessory',
      name: 'UserAvatarAccessoryPage',
      component: UserAvatarAccessoryPage
    },
    {
      path: 'avatar-accessory-info',
      name: 'AvatarAccessoryInfo',
      component: AvatarAccessoryInfo
    },
    {
      path: 'live-enter-effect',
      name: 'UserLiveEnterEffectPage',
      component: UserLiveEnterEffectPage
    }
  ]
}
