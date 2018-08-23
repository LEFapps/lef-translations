import Translator from "./Translator";

const collection = new Translator().translations;

Meteor.publish("translation", ({ _id, md }, language) => {
  // options expect _id, md
  if (!collection.findOne(_id)) {
    collection.insert({ _id, md });
  }
  const fields = {};
  fields[language] = 1;
  return collection.find({ _id }, { fields });
});

Meteor.publish("translationEdit", query => {
  return collection.find(query);
});

Meteor.publish("translationsList", (query, params) => {
  return collection.find(query, params);
});

Meteor.methods({
  updateTranslation: update => {
    return collection.update(update._id, { $set: update });
  },
  totalTranslations: query => {
    return collection.find(query).count();
  }
});

export { Translator };
