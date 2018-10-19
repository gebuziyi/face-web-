
export const sortOrderMapping = {
  ascending: 'asc',
  descending: 'desc'
}

export const menuTypeEnums = [
  {
    type: 0,
    name: '目录',
    tagType: 'danger'
  },
  {
    type: 1,
    name: '菜单',
    tagType: 'success'
  },
  {
    type: 2,
    name: '按钮',
    tagType: 'warning'
  }
]

export const menuTypes = {
  MODULE: 0,
  MENU: 1,
  BUTTON: 2
}

export const BREADCRUMB_IGNORE_PATHS = ['/', '/dashboard']

export const CONTEXT_PATH = '/faceshow-admin'

/**
 * 搜索类型与图表class的对应
 * 1, 搜索用户
 * 2, 搜索话题
 * 3, 搜索群组
 * 4, 搜索音乐
 */
export const SEARCH_TYPE_ICON_MAPPING = {
  type1: {
    icon: 'fa fa-user',
    tagType: 'info'
  },
  type2: {
    icon: 'fa fa-hashtag',
    tagType: ''
  },
  type3: {
    icon: 'fa fa-object-group',
    tagType: 'warning'
  },
  type4: {
    icon: 'fa fa-music',
    tagType: 'success'
  }
}

export const PROMPT_MSG_REG_EXPRESSION = /^[\u4e00-\u9fa5a-zA-Z0-9 ,.。，！!?？]{1,}$/

export const VALID_AVATAR_FILE_EXT = [
  '.jpg',
  '.JPG',
  '.jpeg',
  '.JPEG',
  '.png',
  '.PNG'
];

export const GIVE_AWAY_TYPES = [
  {
    type: 1,
    name: '短视频'
  },
  {
    type: 2,
    name: '直播'
  },
  {
    type: 3,
    name: '1 V 1'
  },
  {
    type: 4,
    name: '聊天'
  },
  {
    type: 5,
    name: '个人中心'
  },
  {
    type: 6,
    name: '问答'
  },
  {
    type: 7,
    name: 'PK'
  },
  {
    type: 8,
    name: '充值'
  },
  {
    type: 9,
    name: '提现'
  },
  {
    type: 10,
    name: 'F币兑换钻石'
  }
]

export const WITHDRAW_STATUS_LIST = [
  {
    status: 0,
    description: '提现失败'
  },
  {
    status: 1,
    description: '提现成功'
  },
  {
    status: 2,
    description: '申请中'
  }
]

/**
 * 最多允许的推荐用户数量, 超过该数量之后将不能继续推荐用户
 */
export const MAX_RECOMMENDED_USER_COUNT = 10;

export const IF_ASSISTANTID = [
  {
    status: 0,
    name: '小助手发送'
  },
  {
    status: 1,
    name: '用户发送'
  }
]

export const IF_READ_BYADMIN = [
  {
    type: 0,
    name: '未读'
  },
  {
    type: 1,
    name: '已读'
  }
]

export const ASSISTANT_MSG_TYPES = [
  {
    type: 201,
    name: '文本消息'
  },
  {
    type: 202,
    name: '表情消息'
  },
  {
    type: 203,
    name: '图片消息'
  },
  {
    type: 204,
    name: '视频话题活动消息'
  },
  {
    type: 205,
    name: '音乐信息活动消息'
  },
  {
    type: 206,
    name: 'Web页面活动消息'
  },
  {
    type: 207,
    name: '直播间活动消息'
  }
]

export const VIDEO_PRIVACY_STATUS_LIST = [
  {
    status: 0,
    description: '私密视频'
  },
  {
    status: 1,
    description: '公开视频'
  },
  {
    status: 2,
    description: '朋友圈视频'
  }
]

export const VEST_SEX_LIST = [
  {
    sex: 0,
    showsex: '女'
  },
  {
    sex: 1,
    showsex: '男'
  }
]

export const GIFT_IS_DISABLE = [
  {
    disable: 0,
    description: '已停用'
  },
  {
    disable: 1,
    description: '正常使用'
  }
]

export const VIDEO_STATUS_LIST = [
  {
    status: 0,
    description: '已删除'
  },
  {
    status: 1,
    description: '正常'
  },
  {
    status: 2,
    description: '已冻结'
  },
  {
    status: 3,
    description: '处理中'
  },
  {
    status: 4,
    description: '处理失败'
  }
]

// 举报来源列表, 问答相关的类型已注释
export const REPORT_TYPE_LIST = [
  {
    type: 1,
    description: '举报视频'
  },
  {
    type: 2,
    description: '举报直播'
  },
  {
    type: 3,
    description: '举报视频评论'
  },
  {
    type: 4,
    description: '举报朋友圈'
  },
  {
    type: 5,
    description: '举报个人'
  },
  // {
  //   type: 6,
  //   description: '举报问答'
  // },
  // {
  //   type: 7,
  //   description: '举报问答回复'
  // },
  {
    type: 8,
    description: '举报1v1'
  },
  // {
  //   type: 9,
  //   description: '举报问答评论'
  // },
  // {
  //   type: 10,
  //   description: '举报问答评论回复'
  // },
  {
    type: 11,
    description: '举报朋友圈评论'
  }
]

export const USER_REGIST_TYPE = [
  {
    type: 1,
    description: '用户名'
  },
  {
    type: 2,
    description: '邮箱'
  },
  {
    type: 3,
    description: '手机'
  },
  {
    type: 4,
    description: '微信'
  },
  {
    type: 5,
    description: 'QQ'
  },
  {
    type: 6,
    description: '微博'
  },
  {
    type: 7,
    description: 'facebook'
  },
  {
    type: 8,
    description: 'twitter'
  },
  {
    type: 9,
    description: '谷歌'
  },
  {
    type: 10,
    description: '图片墙'
  },
  {
    type: 11,
    description: 'line'
  }
]

export const APP_SPLASH_SCREEN_TYPE = [
  {
    type: 0,
    name: '图片'
  },
  {
    type: 1,
    name: '视频'
  }
]

export const APP_SPLASH_SCREEN_CLICKACTIONS = [
  {
    type: 0,
    name: '打开H5页面'
  },
  {
    type: 1,
    name: '进入直播间'
  },
  {
    type: 2,
    name: '进入短视频详情页面'
  }
]

export const APP_ACTIVITY_TYPES = [
  {
    type: 0,
    name: '短视频'
  },
  {
    type: 1,
    name: '直播'
  },
  {
    type: 2,
    name: '注册'
  }
]
