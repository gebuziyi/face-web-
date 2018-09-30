// ============================================ Sys module
import SysHomePage from '../../pages/sys/SysHomePage.vue'
import SysMenuPage from '../../pages/sys/SysMenuPage.vue'
import SysRolePage from '../../pages/sys/SysRolePage.vue'
import SysDeptPage from '../../pages/sys/SysDeptPage.vue'
import SysUserPage from '../../pages/sys/SysUserPage.vue'
import SysSqlMonitorPage from '../../pages/sys/SysSqlMonitorPage.vue'
import SysScheduledJobPage from '../../pages/sys/SysScheduledJobPage.vue'
import SysConfigPage from '../../pages/sys/SysConfigPage.vue'
import SysLogPage from '../../pages/sys/SysLogPage.vue'
import SysUserVestPage from '../../pages/sys/SysUserVestPage.vue'
import SysSetPage from '../../pages/sys/SysSetPage.vue'
import SysRepairPage from '../../pages/sys/SysRepairPage.vue'
import DiamondChangeLogPage from '../../pages/sys/DiamondChangeLogPage.vue'

export const SysModuleRouter = {
  path: '/sys',
  name: 'SysHomePage',
  component: SysHomePage,
  children: [
    {
      path: 'sys-menu',
      name: 'SysMenuPage',
      component: SysMenuPage
    },
    {
      path: 'sys-role',
      name: 'SysRolePage',
      component: SysRolePage
    },
    {
      path: 'sys-dept',
      name: 'SysDeptPage',
      component: SysDeptPage
    },
    {
      path: 'sys-user',
      name: 'SysUserPage',
      component: SysUserPage
    },
    {
      path: 'sys-sql-monitor',
      name: 'SysSqlMonitorPage',
      component: SysSqlMonitorPage
    },
    {
      path: 'sys-scheduled-job',
      name: 'SysScheduledJobPage',
      component: SysScheduledJobPage
    },
    {
      path: 'sys-config',
      name: 'SysConfigPage',
      component: SysConfigPage
    },
    {
      path: 'sys-log',
      name: 'SysLogPage',
      component: SysLogPage
    },
    {
      path: 'sys-vest',
      name: 'SysUserVestPage',
      component: SysUserVestPage
    },
    {
      path: 'sys-set',
      name: 'SysSetPage',
      component: SysSetPage
    },
    {
      path: 'sys-repair',
      name: 'SysRepairPage',
      component: SysRepairPage
    },
    {
      path: 'Diamond-change-log',
      name: 'DiamondChangeLogPage',
      component:  DiamondChangeLogPage
    }
  ]
}
