import { text } from "body-parser";
import React, { Component } from "react";
import "./AutoGenTag.scss";

export default class AutoGenTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      data: [],
      name: "",
      placeholder: "",
      error: "",
      text: "",
    };
  }

  componentDidMount() {
    const name = this.props.name;
    const placeholder = this.props.placeholder;
    const data = this.props.value;
    this.setState({
      ...this.state,
      name: name,
      data: data,
      placeholder: placeholder,
    });
    this.props.getChildState({
      ...this.state,
      name,
      data,
    });
  }

  onTextChanged = (e) => {
    const { items } = this.props;
    const value = e.target.value;

    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, "i");
      suggestions = items.sort().filter((v) => regex.test(v));
    }

    this.setState(() => ({
      ...this.state,
      suggestions,
      text: value,
    }));
  };

  onDelete(item) {
    this.setState({
      ...this.state,
      data: this.state.data.filter((a) => a !== item),
    });
    this.props.getChildState({
      ...this.state,
      data: this.state.data.filter((a) => a !== item),
    });
  }

  renderSuggestions() {
    const { suggestions } = this.state;

    if (suggestions.length === 0) {
      return null;
    }
    const suggestions_ = suggestions.slice(0, 5);
    return (
      <ul>
        {suggestions_.map((item) => (
          <li onClick={() => this.suggestionSelected(item)}>{item}</li>
        ))}
      </ul>
    );
  }

  renderTag() {
    let { data } = this.state;
    if (data.length === 0) {
      return null;
    } else {
      return (
        <>
          {data.map((item) => (
            <span className="tag label label-info">
              {item}
              <span
                data-role="remove"
                onClick={() => this.onDelete(item)}
              ></span>
            </span>
          ))}
        </>
      );
    }
  }

  suggestionSelected(value) {
    this.setState(() => ({
      text: "",
      data: this.state.data.concat(value),
      suggestions: [],
    }));
    this.props.getChildState({
      ...this.state,
      data: this.state.data.concat(value),
    });
  }

  render() {
    const { data, text } = this.state;
    return (
      <div className="bootstrap-tagsinput AutoGenTag">
        {this.renderTag()}
        <input
          type="text"
          placeholder={this.state.placeholder}
          value={text}
          onChange={this.onTextChanged}
          size="30"
        />
        {this.renderSuggestions()}
      </div>
    );
  }
}
