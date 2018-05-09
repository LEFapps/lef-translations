Package.describe({
  summary: "Add translation",
  version: "2.0.0",
  name: "lef:translations"
});

Package.onUse(api => {
  api.use([
    "coffeescript",
    "ecmascript",
    "mongo",
    "check",
    "tracker",
    "alanning:roles",
    "lef:upload"
  ]);
  api.addFiles("server.coffee", "server");
  api.mainModule("client.js", "client");
});

Npm.depends({
  react: "16.3.0",
  lodash: "4.17.5",
  "markdown-it": "8.4.1",
  "markdown-it-video": "0.6.2",
  "@fortawesome/fontawesome-free-solid": "5.0.9",
  "@fortawesome/react-fontawesome": "0.0.18"
});
