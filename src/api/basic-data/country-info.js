import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  countryId: 'country_id',
  createTime: 'country_id'
}

export const getCountryInfoList = function({ query, pager, sorter }) {
  return newClient().get('/country/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      coding: requireNonNull(query.coding) ? query.coding.toUpperCase() : null,
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getCountryInfoDetail = function(typeId) {
  return newClient().get('/country/info/detail/' + typeId)
}

export const updateCountryInfo = function(model) {
  return newClient().post('/country/info/update', model)
}

export const createCountryInfo = function(model) {
  return newClient().post('/country/info/save', model)
}

export const getAllCountryInfo = function() {
  return newClient().get('/country/info/listall/lite')
}

export const disableCountryInfo = function(id) {
  return newClient().post(`/country/info/${id}/disable`)
}
