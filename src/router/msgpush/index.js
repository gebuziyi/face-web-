const MsgPushHomePage = () => import('../../pages/msgpush/MsgPushHomePage')
const MsgPushTypePage = () => import('../../pages/msgpush/MsgPushTypePage')
const MsgTemplatePage = () => import('../../pages/msgpush/MsgTemplatePage')
const MsgInfoPage = () => import('../../pages/msgpush/MsgInfoPage')

export const MsgPushMoudleRouter = {
  path: 'msgpush',
  name: 'MsgPushHomePage',
  component: MsgPushHomePage,
  children: [
    {
      path: 'msgpush-type',
      name: 'MsgPushTypePage',
      component: MsgPushTypePage
    },
    {
      path: 'msg-template',
      name: 'MsgTemplatePage',
      component: MsgTemplatePage
    },
    {
      path: 'msgpush-info',
      name: 'MsgInfoPage',
      component: MsgInfoPage
    }
  ]
}
