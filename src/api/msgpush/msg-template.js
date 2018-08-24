import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  summaryId: 'summary_id'
}

export const getMsgTemplateList = function ({ query, pager, sorter }) {
  return newClient().get('/msgpush/template/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      typeId: requireNonNull(query.typeId),
      countryId: requireNonNull(query.countryId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getMsgTemplateDetail = function (typeId) {
  return newClient().get('/msgpush/template/detail/' + typeId)
}

export const updateMsgTemplate = function (model) {
  return newClient().post('/msgpush/template/update', model)
}

export const removeMsgTemplate = function (ids) {
  return newClient().post('/msgpush/template/delete', [].concat(ids))
}

export const createMsgTemplate = function (model) {
  return newClient().post('/msgpush/template/save', model)
}
