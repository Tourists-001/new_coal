import request from './request'

// 获取账号信息
export const userAccount = () => {
  return request({
    url: '/user/account',
    method: 'get',
    params: {
      timestamp: new Date().getTime()
    }
  })
}

/**
 * 获取用户详情
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * - uid : 用户 id
 * @param {number} uid
 */
export function userDetail(uid) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: {
      uid,
      timestamp: new Date().getTime()
    }
  })
}

/**
 * 喜欢音乐列表（需要登录）
 * 说明 : 调用此接口 , 传入用户 id, 可获取已喜欢音乐id列表(id数组)
 * - uid: 用户 id
 * @param {number} uid
 */
export function userLikedSongsIDs(uid) {
  return request({
    url: '/likelist',
    method: 'get',
    params: {
      uid,
      timestamp: new Date().getTime()
    }
  })
}

/**
 * 获取用户歌单
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 * - uid : 用户 id
 * - limit : 返回数量 , 默认为 30
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.uid
 * @param {number} params.limit
 * @param {number=} params.offset
 */
export function userPlaylist(params) {
  return request({
    url: '/user/playlist',
    method: 'get',
    params
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

/**
 * 获取收藏的歌手（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的歌手
 */
export function likedArtists(params) {
  return request({
    url: '/artist/sublist',
    method: 'get',
    params: {
      limit: params.limit,
      timestamp: new Date().getTime()
    }
  })
}

/**
 * 获取收藏的专辑（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的专辑
 * - limit : 返回数量 , 默认为 25
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.limit
 * @param {number=} params.offset
 */
export function likedAlbums(params) {
  return request({
    url: '/album/sublist',
    method: 'get',
    params: {
      limit: params.limit,
      timestamp: new Date().getTime()
    }
  })
}

/**
 * 获取收藏的MV（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的MV
 */
export function likedMVs(params) {
  return request({
    url: '/mv/sublist',
    method: 'get',
    params: {
      limit: params.limit,
      timestamp: new Date().getTime()
    }
  })
}

/**
 * 获取用户播放记录
 * 说明 : 登录后调用此接口 , 传入用户 id, 可获取用户播放记录
 * - uid : 用户 id
 * - type : type=1 时只返回 weekData, type=0 时返回 allData
 * @param {Object} params
 * @param {number} params.uid
 * @param {number} params.type
 */
export function userPlayHistory(params) {
  return request({
    url: '/user/record',
    method: 'get',
    params
  })
}
