import { newClient } from '../axios-client-factory'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  transformationDiamondId: 'transformation_diamond_id',
  createTime: 'transformation_diamond_id',
  diamond: 'diamond',
  f: 'f'
}

export const getF2dNormList = function({query, pager, sorter}) {
  return newClient().get('/basicdata/f2d/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getF2dNormDetail = function(id) {
  return newClient().get('/basicdata/f2d/detail/' + id)
}

export const updateF2dNorm = function(model) {
  return newClient().post('/basicdata/f2d/update', model)
}

export const createF2dNorm = function(model) {
  return newClient().post('/basicdata/f2d/save', model)
}
