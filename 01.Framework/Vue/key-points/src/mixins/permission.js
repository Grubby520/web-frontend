import Vue from "vue"

let cachedPermissions = Vue.observable({})

function mockApi(operationGroups) {
  return new Promise((resolve, reject) => {
    setTimeout((operationGroups) => {
      resolve([
        'oemSettleAccounts-operations.export',
        'oemSettleAccounts-operations.confirm'
      ])
    }, 300)
  })
}

const getPermissions = (groupName, context) => {
  return new Promise(resolve => {
    const permission = cachedPermissions[groupName]
    if (!permission) {
      mockApi(groupName)
        .then(({ data = [] }) => {
          Vue.set(cachedPermissions, groupName, data)
          context.$forceUpdate() // 需要测试，是否需要重新渲染
          resolve(cachedPermissions[groupName])
        })
    } else {
      resolve(permission)
    }
  })
};

export default (group) => {
  return {
    methods: {
      checkPermission(type) {
        // 需要测试，这样应该不需要强制渲染
        getPermissions(group, this).then(res => {
          const operationCode = `${group}.${type}`
          return res.includes(operationCode)
        })
      }
    }
  }
}
