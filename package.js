Package.describe({
  summary: 'Translations/CMS for Meteor/React',
  version: '3.2.8',
  name: 'lef:translations'
})

Package.onUse(api => {
  api.use([
    'ecmascript',
    'mongo',
    'alanning:roles',
    'lef:adminlist',
    'deanius:promise',
    'lef:imgupload',
    'swydo:ddp-apollo'
  ])
  api.mainModule('server.js', 'server')
  api.mainModule('client.js', 'client')
})

Npm.depends({
  '@fortawesome/react-fontawesome': '0.1.0',
  // '@lefapps/forms': '1.8.15',
  '@lefapps/uploader': '0.0.5',
  '@lefapps/translations': '4.0.2',
  '@lefapps/translations-server': '4.0.2',
  'markdown-it': '10.0.0',
  'markdown-it-attrs': '4.0.0',
  'markdown-it-link-attributes': '3.0.0',
  'markdown-it-video': '0.6.3',
  'markdown-it-picture': '0.0.1',
  '@apollo/client': '3.3.19',
  'apollo-link-ddp': '3.0.0',
  graphql: '15.5.0',
  'graphql-tools': '7.0.5',
  reactstrap: '7.1.0'
})
