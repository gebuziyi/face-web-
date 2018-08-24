import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  id: 'msg_id',
  createTime: 'msg_id'
}

export const getAssistantFaqTypeList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null
  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }
  return newClient().get('/assistant/faq-type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      typeId: requireNonNull(query.typeId),
      typeName: requireNonNull(query.countryId),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllFsqTypeType = function () {
  return newClient().get('/assistant/faq-type/all/lite')
}

export const updateAssistantFaqType = function (model) {
  return newClient().post('/assistant/faq-type/update', model)
}

export const removeAssistantFaqType = function (ids) {
  return newClient().post('/assistant/faq-type/delete', [].concat(ids))
}

export const createAssiatantFaqType = function (model) {
  return newClient().post('/assistant/faq-type/save', model)
}

export const getAssistantFaqTypeDetail = function (typeId) {
  return newClient().get('/assistant/faq-type/detail/' + typeId)
}
