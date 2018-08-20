import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

const collection = new Mongo.Collection("translations");

export default class Translator {
  constructor() {
    this.languages = ["nl", "fr", "en"];
    this.default = "nl";
    this.translations = collection;
    if (Meteor.isClient) this.initLanguage();
  }
  initLanguage() {
    let language;
    const user = Meteor.user();
    language = user ? user.profile.language : undefined;
    if (!language) {
      const navLang = (navigator.language || navigator.userLanguage).split(
        "-"
      )[0];
      if (this.languages.includes(navLang)) {
        language = navLang;
      } else {
        language = this.default;
      }
    }
    this.currentLanguage = language;
  }
  setLanguages(languages) {
    this.languages = languages;
  }
  setDefault(language) {
    this.default = language;
  }
  setCurrentLanguage(language) {
    if (Meteor.user()) {
      return Meteor.users.update(Meteor.user()._id, {
        $set: {
          "profile.language": language
        }
      });
    }
    this.currentLanguage = language;
  }
  getLanguages() {
    return this.languages;
  }
  getDefault() {
    return this.default;
  }
  getCurrentLanguage() {
    return this.currentLanguage;
  }
}
