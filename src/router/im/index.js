// ============================================ Instant message module
import ImHomePage from '../../pages/im/ImHomePage.vue'
import GroupTypePage from '../../pages/im/GroupTypePage.vue'
import GroupInfoPage from '../../pages/im/GroupInfoPage.vue'
import UserGroupPage from '../../pages/im/UserGroupPage.vue'

export const ImModuleRouter = {
  path: 'im',
  name: 'ImHomePage',
  component: ImHomePage,
  children: [
    {
      path: 'group-type',
      name: 'GroupTypePage',
      component: GroupTypePage
    },
    {
      path: 'group-info',
      name: 'GroupInfoPage',
      component: GroupInfoPage
    },
    {
      path: 'user-group',
      name: 'UserGroupPage',
      component: UserGroupPage
    }
  ]
}
