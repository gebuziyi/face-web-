import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  logId: 'log_id',
  times: 'times',
  createTime: 'log_id',
  jobId: 'job_id'
}

export const getScheduledLogList = function({query, pager, sorter}) {
  return newClient().get('/sys/scheduleLog/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      jobId: requireNonNull(query.jobId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysScheduledJobList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/sys/schedule/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      beanName: requireNonNull(query.beanName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getSysScheduledJobDetail = function(jobId) {
  return newClient().get('/sys/schedule/info/' + jobId)
}

export const updateSysScheduledJob = function(model) {
  return newClient().post('/sys/schedule/update', model)
}

export const removeSysScheduledJob = function(ids) {
  return newClient().post('/sys/schedule/delete', [].concat(ids))
}

export const createSysScheduledJob = function(model) {
  return newClient().post('/sys/schedule/save', model)
}

export const pauseSysScheduledJob = function(ids) {
  return newClient().post('/sys/schedule/pause', [].concat(ids))
}

export const resumeSysScheduledJob = function(ids) {
  return newClient().post('/sys/schedule/resume', [].concat(ids))
}

export const runSysScheduledJob = function(ids) {
  return newClient().post('/sys/schedule/run', [].concat(ids))
}
