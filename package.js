Package.describe({
  summary: 'Translations/CMS for Meteor/React',
  version: '2.7.1',
  name: 'lef:translations'
})

Package.onUse(api => {
  api.use(['ecmascript', 'mongo', 'alanning:roles', 'lef:adminlist'])
  api.mainModule('server.js', 'server')
  api.addFiles('style.css', 'client')
  api.mainModule('client.js', 'client')
})

Npm.depends({
  '@fortawesome/react-fontawesome': '0.1.0',
  'markdown-it': '8.4.2',
  'markdown-it-video': '0.6.3'
})
