// 生成各个页面需要的空对象

// ======================================================== Gift

export const emptyGiftInfo = function () {
  let empty = {
    giftId: null,
    typeId: null,
    gname: null,
    price: null,
    img: null,
    creator: null,
    createTime: null,
    svgaUrl: null,
    disabled: null,
    exclusive: null,
    levelId: null
  }
  return empty
}

export const emptyUserAvatarAccessory = function () {
  let empty = {
    id: null,
    name: null,
    introduction: null,
    url: null,
    priority: null,
    module: null

  }

  return empty
}

export const emptyGiftType = function () {
  let empty = {
    typeId: null,
    gname: null,
    img: null,
    creator: null,
    createTime: null
  }

  return empty
}

// ======================================================== QA

export const emptyQaType = function () {
  let empty = {
    typeId: null,
    typeName: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }
  return empty;
}

export const emptyQaRewardMoney = function () {
  let empty = {
    rewardId: null,
    price: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

export const emptyQaRecommend = function () {
  let empty = {
    reId: null,
    theme: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

export const emptyQaSetDays = function () {
  let empty = {
    setId: null,
    days: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

// ======================================================== SYS

export const emptySysMenu = function () {
  let empty = {
    menuId: null,
    parentId: null,
    parentName: null,
    name: null,
    url: null,
    icon: null,
    perms: null,
    type: null,
    orderNum: 0,
    open: null,
    list: null
  }

  return empty
}

export const emptySysRole = function () {
  let empty = {
    roleId: null,
    roleName: null,
    remark: null,
    deptId: null,
    deptName: null,
    menuIdList: [],
    deptIdList: [],
    createTime: null
  }
  return empty
}

export const emptySysDept = function () {
  let empty = {
    deptId: null,
    parentId: null,
    name: null,
    parentName: null,
    orderNum: 0,
    open: false,
    list: []
  }

  return empty
}

export const emptySysUser = function () {
  let empty = {
    userId: null,
    username: null,
    password: null,
    salt: null,
    email: null,
    mobile: null,
    status: null,
    deptId: null,
    deptName: null,
    roleIdList: [],
    createUserId: null,
    createTime: null
  }

  return empty
}

export const emptySysScheduledJob = function () {
  let empty = {
    jobId: null,
    beanName: null,
    methodName: null,
    params: null,
    cronExpression: null,
    status: null,
    remark: null,
    createTime: null
  }

  return empty
}

export const emptySysConfig = function () {
  let empty = {
    id: null,
    key: null,
    value: null,
    remark: null
  }

  return empty
}

export const emptySysSet = function () {
  let empty = {
    setId: null,
    sname: null,
    parameter: null,
    createTime: null,
    creator: null,
    editorTime: null,
    editor: null,
    del: null,
    url: null,
    createUser: null,
    editorUser: null
  }

  return empty
}

export const emptyassistant = function () {
  let empty = {
    txt: null,
    msgId: null,
    msgType: null
  }

  return empty
}

export const tencentCloud = function () {
  let empty = {
    dirtyWord: null
  }
  return empty
}

// ======================================================== Recharge

export const emptyRechargeNorm = function () {
  let empty = {
    rechargeId: null,
    sign: null,
    priceChina: null,
    priceAmerica: null,
    number: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null,
    activity: null,
    activityId: null
  }

  return empty
}

export const emptyRechargeOrder = function () {
  let empty = {
    orderId: null,
    typeId: null,
    rechargeId: null,
    userId: null,
    price: null,
    statues: null,
    orderNo: null,
    createTime: null
  }

  return empty
}

export const emptyRechargeOrderDetail = function () {
  let empty = {
    orderId: null,
    typeId: null,
    rechargeId: null,
    userId: null,
    price: null,
    statues: null,
    orderNo: null,
    createTime: null,
    payTypeName: null,
    rechargeNormName: null,
    username: null,
    statusDescription: null
  }

  return empty
}

export const emptyRechargeActivity = function () {
  let empty = {
    activityId: null,
    preferences: null,
    introduction: null,
    activityName: null,
    preferenCount: null,
    img: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null
  }

  return empty;
}
// ======================================================== Recharge

export const emptyWithdrawApplication = function () {
  let empty = {
    aid: null,
    userId: null,
    createTime: null,
    money: null,
    statues: null,
    payType: null,
    transfer: null,
    check: null,
    checkMan: null,
    checkTime: null
  }

  return empty
}

export const emptyWithdrawApplicationDetail = function () {
  let empty = {
    aid: null,
    userId: null,
    username: null,
    createTime: null,
    money: null,
    statues: null,
    statusDescription: null,
    payType: null,
    payTypeName: null,
    transfer: null,
    transferUsername: null,
    check: null,
    checkMan: null,
    checkManUsername: null,
    checkTime: null
  }

  return empty
}

export const emptyWithdrawNorm = function () {
  let empty = {
    withdrawId: null,
    price: null,
    f: null,
    currency: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

// ======================================================== Basic data

export const emptyCountryInfo = function () {
  let empty = {
    countryId: null,
    cname: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null,
    memo: null,
    logo: null,
    coding: null,
    codingISO: null,
    countryNum: null,
    language: null,
    disabled: null,
    nums: null
  }

  return empty
}

export const emptyPayType = function () {
  let empty = {
    typeId: null,
    payName: null,
    createTime: null,
    creator: null,
    editorTime: null,
    editor: null,
    country: null
  }

  return empty
}

export const emptyF2dNorm = function () {
  let empty = {
    tranformationDiamondId: null,
    diamond: null,
    f: null,
    createTime: null,
    creator: null
  }

  return empty
}

export const emptyReportType = function () {
  let empty = {
    typeId: null,
    reportType: null,
    tname: null,
    createTime: null,
    creator: null,
    editorTime: null,
    editor: null
  }

  return empty
}

// ======================================================== Music module

export const emptyMusicType = function () {
  let empty = {
    typeId: null,
    typeName: null,
    typeImg: null,
    createTime: null,
    creator: null,
    editorTime: null,
    editor: null
  }

  return empty
}

export const emptyMusicInfo = function () {
  let empty = {
    musicId: null,
    typeId: null,
    userId: null,
    url: null,
    mname: null,
    img: null,
    createTime: null,
    country: null,
    numbers: null,
    introduce: null,
    singer: null
  }

  return empty
}

// ======================================================== Globalization module

export const emptyG11nInfo = function () {
  let empty = {
    gid: null,
    country: null,
    cn: null,
    foreign: null,
    idDel: 0,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null,
    keys: null
  }

  return empty
}

// ======================================================== Globalization module

export const emptyGroupType = function () {
  let empty = {
    typeId: null,
    typeName: null,
    typeImg: null,
    heatRe: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

export const emptyGroupInfo = function () {
  let empty = {
    typeId: null,
    typeName: null,
    typeImg: null,
    heatRe: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

export const emptyUserGroup = function () {
  let empty = {
    groupId: null,
    newsletterId: null,
    userId: null,
    createTime: null,
    role: null
  }

  return empty
}

// ======================================================== Video module

export const emptyVideoType = function () {
  let empty = {
    typeId: null,
    tname: null,
    img: null,
    backgroundImg: null,
    createTime: null,
    creator: null,
    introduction: null
  }

  return empty
}

export const emptyVideoTopic = function () {
  let empty = {
    topicId: null,
    tname: null,
    userId: null,
    img: null,
    createTime: null,
    introduction: null,
    accountId: null,
    hot: null
  }

  return empty
}

// ======================================================== User module

export const emptyUserLevel = function () {
  let empty = {
    levelId: null,
    names: null,
    memo: null,
    editor: null,
    editorTime: null,
    createTime: null,
    creator: null,
    del: null,
    sort: null
  }

  return empty
}

export const emptyHobbyInfo = function () {
  let empty = {
    hobbyId: null,
    tags: null,
    type: null,
    createTime: null
  }

  return empty
}

export const emptyUserDetail = function () {
  let empty = {
    fileList: [],
    type: null,
    signature: null,
    loginTime: null,
    lastTime: null,
    qrCode: null,
    intro: null,
    address: null,
    attentionNum: null,
    anchorNo: null,
    birthday: null,
    job: null,
    stature: null,
    weight: null,
    constellation: null
  }

  return empty
}

export const emptyEmotionInfoTags = function () {
  let empty = {
    tagsId: null,
    tagName: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null
  }

  return empty
}

export const emptyMakeFriendIntentionTag = function () {
  let empty = {
    tagId: null,
    tagName: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null
  }

  return empty
}

export const emptyJobInfo = function () {
  let empty = {
    infoId: null,
    infoName: null,
    parentId: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null
  }

  return empty
}

export const emptyUserRecommendType = function () {
  let empty = {
    typeId: null,
    name: null,
    description: null,
    sort: null,
    creator: null,
    createTime: null,
    editor: null,
    editorTime: null
  }

  return empty;
}
// ======================================================== Live module

export const emptyLiveType = function () {
  let empty = {
    typeId: null,
    typeName: null,
    introduction: null,
    createTime: null,
    creator: null
  }

  return empty
}

// ======================================================== Message push module

export const emptyMsgPushType = function () {
  let empty = {
    typeId: null,
    typeName: null,
    show: null,
    needPush: null,
    createTime: null,
    creator: null,
    editor: null,
    editorTime: null
  }

  return empty
}
export const emptyMsgTemplate = function () {
  let empty = {
    summaryId: null,
    typeId: null,
    cnContent: null,
    content: null,
    countryId: null
  }

  return empty
}

// ========================================================= UserFreezeType module

export const emptyUserFreezeType = function () {
  let empty = {
    typeId: null,
    name: null,
    introduction: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}

// ======================================================== AssistantFaqType model

export const emptyAssistantFaqType = function () {
  let empty = {
    typeId: null,
    typeName: null,
    typeUrl: null,
    sort: null,
    creator: null,
    createTime: null,
    editor: null,
    editTime: null
  }

  return empty
}
