import React, { Component } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  Table,
  Collapse,
  CardBody,
  Card
} from "reactstrap";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFlag from "@fortawesome/fontawesome-free-solid/faFlag";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";
import faCheck from "@fortawesome/fontawesome-free-solid/faCheck";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faAlignLeft from "@fortawesome/fontawesome-free-solid/faAlignLeft";
import faSearch from "@fortawesome/fontawesome-free-solid/faSearch";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { contains, extend } from "underscore";
import Translator from "./lib";
import { Session } from "meteor/session";
import { Roles } from "meteor/alanning:roles";
import Upload from "meteor/lef:upload";

const _ = { contains, extend };

const markdown = require("markdown-it")({
  html: true,
  linkify: true,
  typography: true
}).use(require("markdown-it-video"));

Tracker.autorun(() => {
  let language, ref;
  language = (ref = Meteor.user()) != null ? ref.profile.language : void 0;
  if (!language) {
    const navLang = (navigator.language || navigator.userLanguage).split(
      "-"
    )[0];
    if (_.contains(Translator.languages, navLang)) {
      language = navLang;
    } else {
      language = Translator.default;
    }
    Session.set("language", language);
  }
});

Translator.setLanguage = language => {
  if (Meteor.user()) {
    return Meteor.users.update(Meteor.user()._id, {
      $set: {
        "profile.language": language
      }
    });
  } else {
    return Session.set("language", language);
  }
};

const PickLanguage = () => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={faFlag} />
      </DropdownToggle>
      <DropdownMenu right>
        {Translator.languages.map(language => {
          return (
            <DropdownItem
              key={language}
              onClick={() => Translator.setLanguage(language)}
            >
              {language}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

class TranslationModal extends Component {
  constructor(props) {
    super(props);
    const state = props.translation || {};
    state.upload = false;
    this.state = state;
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
  }
  static getDerivedStateFromProps({ translation }, prevState) {
    return translation || null;
  }
  handleChange(e, language) {
    this.setState({ [language]: e.target.value });
  }
  handleUpload(result) {
    console.log(result);
  }
  toggleUpload() {
    this.setState({ upload: !this.state.upload });
  }
  save() {
    Meteor.call("updateTranslation", this.state, (error, result) => {
      if (result) {
        this.props.toggle();
      } else {
        alert(JSON.stringify(error));
      }
    });
  }
  render() {
    if (this.props.loading) return null;
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle} size="lg">
        <ModalHeader toggle={this.props.toggle}>
          <FontAwesomeIcon icon={faEdit} /> {this.props.translation._id}
        </ModalHeader>
        <ModalBody>
          {/* <div className="row">
            <div className="col">
              <Button onClick={this.toggleUpload}>Image upload</Button>
              <Collapse isOpen={this.state.upload}>
                <Card>
                  <CardBody>
                    <Upload
                      handleUpload={result => this.handleUpload(result)}
                    />
                  </CardBody>
                </Card>
              </Collapse>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <hr />
            </div>
          </div> */}
          <div className="row">
            {Translator.languages.map(language => {
              return (
                <div className="col" key={language}>
                  <h6>{language}</h6>
                  {this.props.translation.md ? (
                    <div>
                      <Input
                        type="textarea"
                        value={this.state[language]}
                        onChange={e => this.handleChange(e, language)}
                        rows="10"
                      />
                      <hr />
                      <div
                        dangerouslySetInnerHTML={{
                          __html: markdown.render(this.state[language] || "")
                        }}
                      />
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={this.state[language]}
                      onChange={e => this.handleChange(e, language)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.save} color="success">
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button onClick={this.toggle} color="danger">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const ModalContainer = withTracker(props => {
  const handle = Meteor.subscribe("translations", props.translation._id);
  const translation = Translator.translations.findOne(props.translation._id);
  return { translation, loading: !handle.ready() };
})(TranslationModal);

class Translate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    this.toggleEditing = this.toggleEditing.bind(this);
  }
  toggleEditing() {
    if (
      Roles.userIsInRole(Meteor.userId(), "admin") &&
      !this.props.preventInPageEdit
    ) {
      this.setState({ editing: !this.state.editing });
    }
  }
  render() {
    const tr = this.props.translation;
    const text =
      this.props.md && tr ? markdown.render(tr) : tr || this.props._id;
    return (
      <div>
        <ModalContainer
          translation={this.props}
          toggle={this.toggleEditing}
          open={this.state.editing}
        />
        <span
          className="translation"
          dangerouslySetInnerHTML={{ __html: text }}
          onDoubleClick={this.toggleEditing}
        />
      </div>
    );
  }
}

const TranslateContainer = withTracker(function(options) {
  var ref, ref1, ref2;
  const language =
    ((ref = Meteor.user()) != null ? ref.profile.language : void 0) ||
    Session.get("language");
  const handle = Meteor.subscribe("translation", options, language);
  const translation =
    (ref1 = Translator.translations) != null
      ? (ref2 = ref1.findOne(options._id)) != null
        ? ref2[language]
        : void 0
      : void 0;
  return {
    translation: translation
  };
})(Translate);

class TranslationEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    this.toggleEditing = this.toggleEditing.bind(this);
  }
  toggleEditing() {
    this.setState({ editing: !this.state.editing });
  }
  render() {
    return (
      <div>
        <ModalContainer
          translation={this.props.translation}
          toggle={this.toggleEditing}
          open={this.state.editing}
        />
        <Button onClick={this.toggleEditing} size="sm">
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </div>
    );
  }
}

class Translations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {}
    };
  }
  search(e, key) {
    const query = this.state.query;
    if (e.target.value) {
      query[key] = {
        $regex: e.target.value,
        $options: "i"
      };
    } else {
      delete query[key];
    }
    this.setState(query);
  }
  render() {
    return (
      <Table hover>
        <thead>
          <tr>
            <th />
            <th>ID</th>
            {Translator.languages.map(language => {
              return <th key={language}>{language}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
            {["_id"].concat(Translator.languages).map(item => {
              return (
                <td key={item}>
                  <InputGroup>
                    <Input onChange={e => this.search(e, item)} />
                    <InputGroupAddon addonType="append">
                      <Button>
                        <FontAwesomeIcon icon={faSearch} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </td>
              );
            })}
          </tr>
          {this.props.translations
            .find(this.state.query, { sort: { _id: 1 } })
            .fetch()
            .map(translation => {
              return (
                <tr key={translation._id}>
                  <td>
                    <TranslationEdit translation={translation} />
                  </td>
                  <th>{translation._id}</th>
                  {Translator.languages.map(language => {
                    return (
                      <td key={`${language}_${translation._id}`}>
                        {translation.md ? (
                          <FontAwesomeIcon icon={faAlignLeft} />
                        ) : (
                          translation[language]
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </Table>
    );
  }
}

const TranslationsContainer = withTracker(props => {
  handle = Meteor.subscribe("translations");
  return {
    translations: Translator.translations,
    loading: !handle.ready()
  };
})(Translations);

export {
  TranslateContainer as Translate,
  PickLanguage,
  TranslationsContainer as Translations
};
