print("Synchronizing translations from production to the local environment");

var prodSettings = JSON.parse(cat('../../secret/production-settings.json'));

var prodURL = prodSettings["galaxy.meteor.com"].env.MONGO_URL
var devURL = '127.0.0.1:3001/meteor';

var production = connect(prodURL);
var dev = connect(devURL);


var translations = production.translations.find({});
print("Upserting " + translations.count() + " translations");
translations.forEach(function(t) {dev.translations.insert(t);});
