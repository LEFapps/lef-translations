Package.describe({
  summary: 'Translations/CMS for Meteor/React',
  version: '2.2.9',
  name: 'lef:translations'
})

Package.onUse(api => {
  api.use(['ecmascript', 'mongo', 'alanning:roles', 'lef:adminlist'])
  api.mainModule('server.js', 'server')
  api.mainModule('client.js', 'client')
})

Npm.depends({
  react: '16.5.0',
  lodash: '4.17.5',
  '@fortawesome/fontawesome': '1.1.8',
  '@fortawesome/fontawesome-svg-core': '1.2.0',
  '@fortawesome/free-solid-svg-icons': '5.2.0',
  '@fortawesome/react-fontawesome': '0.1.0',
  'markdown-it': '8.4.2',
  'markdown-it-video': '0.6.3'
})
