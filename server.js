import Translator from "./lib";

Meteor.publish("translation", (options, language) => {
  // options expect _id, md, preventInPageEdit
  if (!Translator.translations.findOne(options._id)) {
    Translator.translations.insert(options);
  }
  const fields = {};
  fields[language] = 1;
  return Translator.translations.find({ _id: options._id }, { fields: fields });
});

Meteor.publish("translations", id => {
  if (id) {
    return Translator.translations.find({ _id: id });
  } else {
    return Translator.translations.find({}, { sort: { _id: 1 } });
  }
});

Meteor.methods({
  updateTranslation: update => {
    return Translator.translations.update(update._id, { $set: update });
  },
  removeTranslation: id => {
    // Guard 'admin', -> Translator.translations.remove _id:id
  }
});
