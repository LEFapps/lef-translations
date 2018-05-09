import { Mongo } from "meteor/mongo";

Translator = {
  translations: new Mongo.Collection("translations"),
  languages: ["nl", "fr"],
  default: "nl"
};

export default Translator;
