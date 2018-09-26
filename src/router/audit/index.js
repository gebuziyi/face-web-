const AuditHomePage = () => import('../../pages/audit/AuditHomePage.vue');
const RechargeUserConsumeRatioAuditPage = () => import('../../pages/audit/recharge/RechargeUserConsumeRatioAuditPage.vue');
const VideoTypePlayCountAuditPage = () => import('../../pages/audit/videoType/VideoTypePlayCountAuditPage.vue');
const PayTypeUserCountAuditPage = () => import('../../pages/audit/payType/PayTypeUserCountAuditPage.vue');
const PayTypeDiamondCountAuditPage = () => import('../../pages/audit/payType/PayTypeDiamondCountAuditPage.vue');
const PayTypeInTop10CountryAuditPage = () => import('../../pages/audit/payType/PayTypeInTop10CountryAuditPage.vue');
const DiamondCountInCountryAuditPage = () => import('../../pages/audit/recharge/DiamondCountInCountryAuditPage.vue');
const ModulesAuditUserSearchByKey = () => import('../../pages/audit/searchKey/UserSearchByKey.vue');
const ModulesAuditVideoTypeVideoCount = () => import('../../pages/audit/videoType/VideoTypeVideoCount.vue');
const VideoGiftAudit = () => import('../../pages/audit/videoInfo/VideoGiftAudit.vue');
const videoPlayAudit = () => import('../../pages/audit/videoInfo/videoPlayAudit.vue');
const userRechargeRatioAudit = () => import('../../pages/audit/user/userRechargeRatioAudit.vue');
const avgRechargePriceAudit = () => import('../../pages/audit/recharge/avgRechargePriceAudit.vue');
const UserAuditPage = () => import('../../pages/audit/user/UserAuditPage.vue');

export const AuditModuleRouter = {
  path: 'audit',
  name: 'AuditHomePage',
  component: AuditHomePage,
  children: [
    {
      path: 'user/user-audit',
      name: 'UserAuditPage',
      component: UserAuditPage
    },
    {
      path: 'recharge-user-consume-ratio-audit',
      name: 'RechargeUserConsumeRatioAuditPage',
      component: RechargeUserConsumeRatioAuditPage
    },
    {
      path: 'video-type-play-count-audit',
      name: 'VideoTypePlayCountAuditPage',
      component: VideoTypePlayCountAuditPage
    },
    {
      path: 'pay-type-user-count',
      name: 'PayTypeUserCountAuditPage',
      component: PayTypeUserCountAuditPage
    },
    {
      path: 'pay-type-diamond-count',
      name: 'PayTypeDiamondCountAuditPage',
      component: PayTypeDiamondCountAuditPage
    },
    {
      path: 'diamond-count-by-pay-type-top10-country-audit',
      name: 'PayTypeInTop10CountryAuditPage',
      component: PayTypeInTop10CountryAuditPage
    },
    {
      path: 'diamond-count-in-country-audit',
      name: 'DiamondCountInCountryAuditPage',
      component: DiamondCountInCountryAuditPage
    },
    {
      path: 'user-search-by-key',
      name: 'ModulesAuditUserSearchByKey',
      component: ModulesAuditUserSearchByKey
    },
    {
      path: 'video-type-video-count-audit',
      name: 'ModulesAuditVideoTypeVideoCount',
      component: ModulesAuditVideoTypeVideoCount
    },
    {
      path: 'video-gift-audit',
      name: 'VideoGiftAudit',
      component: VideoGiftAudit
    },
    {
      path: 'video-play-audit',
      name: 'videoPlayAudit',
      component: videoPlayAudit
    },
    {
      path: 'user-recharge-ratio-audit',
      name: 'userRechargeRatioAudit',
      component: userRechargeRatioAudit
    },
    {
      path: 'avg-recharge-price-audit',
      name: 'avgRechargePriceAudit',
      component: avgRechargePriceAudit
    }
  ]
}
