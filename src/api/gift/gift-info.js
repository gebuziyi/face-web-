import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  giftId: 'gift_id',
  price: 'price',
  createTime: 'gift_id'
}

// 分页查询礼品信息列表
export const getGiftInfoList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/gift/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      gname: requireNonNull(query.gname),
      typeId: requireNonNull(query.typeId),
      priceStart: requireNonNull(query.priceStart),
      priceEnd: requireNonNull(query.priceEnd),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

// 根据礼品信息ID获取礼品详情
export const getGiftInfoDetail = function (giftId) {
  return newClient().get('/gift/info/detail/' + giftId)
}

// 更新礼品信息
export const updateGiftInfo = function (model) {
  return newClient().post('/gift/info/update', model)
}

// 根据ID删除指定礼品信息
export const removeGiftInfoById = function (id) {
  return newClient().post('/gift/info/delete', [].concat(id))
}

// 创建礼品信息
export const createGiftInfo = function (model) {
  return newClient().post('/gift/info/save', model)
}

// 获取所有礼品类型(id, name), 用于下拉列表展示
export const getGiftTypeList = function () {
  return newClient().get('/gift/type/listall')
}

export const getAllGiftInfo = function () {
  return newClient().get('/gift/info/listall/lite')
}

export const disableGiftInfo = function (id) {
  return newClient().post(`/gift/info/${id}/disable`)
}

export const enableGiftInfo = function (id) {
  return newClient().post(`/gift/info/${id}/enable`)
}
