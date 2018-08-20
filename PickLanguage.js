import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import fontawesome from "@fortawesome/fontawesome";

import Translator from "./Translator";

fontawesome.library.add(faFlag);

translator = new Translator();

export default (PickLanguage = () => {
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon="flag" />
      </DropdownToggle>
      <DropdownMenu right>
        {translator.languages.map(language => {
          return (
            <DropdownItem
              key={language}
              onClick={() => translator.setLanguage(language)}
            >
              {language}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
});
