Package.describe({
  summary: "Add translation",
  version: "2.0.4",
  name: "lef:translations",
});

Package.onUse(api => {
  api.use([
    "ecmascript",
    "mongo",
    "check",
    "tracker",
    "session",
    "alanning:roles",
  ]);
  api.addFiles("server.js", "server");
  api.mainModule("client.js", "client");
});

Npm.depends({
  react: "16.3.0",
  lodash: "4.17.5",
  "markdown-it": "8.4.1",
  "markdown-it-video": "0.6.2",
  "@fortawesome/fontawesome": "1.1.8",
  "@fortawesome/fontawesome-svg-core": "1.2.0",
  "@fortawesome/free-solid-svg-icons": "5.2.0",
  "@fortawesome/react-fontawesome": "0.1.0"
});
