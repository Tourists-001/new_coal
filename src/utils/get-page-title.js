// import defaultSettings from '@/settings'
const defaultSettings = {
  title: '星球音乐'
}
const title = defaultSettings.title || '星球音乐'
/**
 * 获取新的网页 title
 * @param {*} pageTitle
 * @returns
 */
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
