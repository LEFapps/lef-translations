import React, { Component } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

export default class MarkdownHelp extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }
  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }
  render() {
    return (
      <span>
        <Button id="markdownhelp" outline color="warning" onClick={this.toggle}>
          <FontAwesomeIcon icon={faQuestion} />
        </Button>
        <Popover
          placement="auto"
          isOpen={this.state.popoverOpen}
          target="markdownhelp"
          toggle={this.toggle}
        >
          <PopoverHeader>Markdown Help</PopoverHeader>
          <PopoverBody>
            <h5>Titels</h5>
            <p>
              # Grote titel
              <br /> ## Titel
              <br /> ### Kleine titel
            </p>
            <h5>Lijsten</h5>
            <p>
              1. Eerste genummerde item
              <br /> 2. Een tweede item
              <br /> ⋅⋅* Niet genumerd sub-item
              <br /> * Niet genummerde lijst item
              <br /> * Nog een item
            </p>
            <h5>Tekst</h5>
            <p>
              __vetgedrukt__
              <br /> _schuingedrukt_
            </p>
            <h5>Links</h5>
            <p>[leesbare tekst](https://www.voorbeeld.com)</p>
            <h5>Quote</h5>
            <p>> Quote</p>
            <h5>Video embed</h5>
            <p>
              @[youtube](https://www.youtube.com/watch?v=_gMq3hRLDD0)
              <br />
              @[vimeo](https://vimeo.com/212404816)
            </p>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}