import _ from 'lodash'
import debug from 'debug'
const log = debug('runtime:template')
const compiledTemplates = new Map()

export default function template (tplString, variables) {
  if (log.enabled) {
    log('模板计算', tplString, variables)
  }
  // eslint-disable-next-line no-new-func
  if (typeof tplString === 'string') {
    if (tplString.startsWith('${')) {
      // 用 ${} 为模板计算 这类方式只有110版本才有，问题是性能低容易出错，后续版本弃用
      try {
        // eslint-disable-next-line no-new-func
        const func = new Function(...Object.keys(variables), `return \`${tplString}\`;`)

        return func(...Object.values(variables))
      } catch (e) {
        return null
      }
    } else if (tplString.match(/{{([\s\S]+?)}}/g)) {
      // 用 {{ 为模板进行计算的情况 }}
      if (!compiledTemplates.get(tplString)) {
        compiledTemplates.set(tplString, _.template(tplString, {
          interpolate: /{{([\s\S]+?)}}/g
        }))
      }
      return compiledTemplates.get(tplString)(variables)
    } else if (tplString.indexOf('{') === -1) {
      // javascript表达式情况。 例如 prop.key这样
      try {
        // 首先转换为模板字符串
        const tplStringCon = `{{JSON.stringify(${tplString})}}`
        // 用lodash计算为结果字符串
        const tplFunc = _.template(tplStringCon, {
          interpolate: /{{([\s\S]+?)}}/g
        })

        // 反向解码
        return JSON.parse(tplFunc(variables))
      } catch (e) {
        return _.get(variables, tplString)
        // return ObjectPath.get(variables, tplString)
      }
    } else {
      try {
        const config = JSON.parse(tplString)

        return config
        // TODO JSON配置形式
      } catch (e) {
        return tplString
      }
    }
  } else {
    return tplString
  }
}

export function isTemplateStr (tplString) {
  return tplString.startsWith('${') || tplString.startsWith('{{')
}
