import Translator from "./Translator";

const collection = new Translator().translations;

Meteor.publish("translation", (options, language) => {
  // options expect _id, md, preventInPageEdit
  if (!collection.findOne(options._id)) {
    collection.insert(options);
  }
  const fields = {};
  fields[language] = 1;
  return collection.find({ _id: options._id }, { fields: fields });
});

Meteor.publish("translations", (query, params = {}) => {
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
