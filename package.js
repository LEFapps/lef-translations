Package.describe({
  summary: 'Translations/CMS for Meteor/React',
  version: '3.2.6',
  name: 'lef:translations'
})

Package.onUse(api => {
  api.use([
    'ecmascript',
    'mongo',
    'alanning:roles',
    'lef:adminlist',
    'deanius:promise',
    'lef:imgupload'
  ])
  api.mainModule('server.js', 'server')
  api.mainModule('client.js', 'client')
})

Npm.depends({
  '@fortawesome/react-fontawesome': '0.1.0',
  '@lefapps/translations': '3.1.7',
  'markdown-it': '8.4.2',
  'markdown-it-video': '0.6.3',
  'markdown-it-picture': '0.0.1'
})
