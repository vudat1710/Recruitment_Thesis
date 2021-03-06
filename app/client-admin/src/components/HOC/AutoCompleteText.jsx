import React from "react";
import "./AutoCompleteText.scss";

export default class AutoCompleteText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      text: "",
      name: "",
      placeholder: "",
    };
  }

  componentDidMount() {
    const name = this.props.name;
    const placeholder = this.props.placeholder;
    const text = this.props.value;
    this.setState({
      ...this.state,
      name: name,
      text: text,
      placeholder: placeholder,
    });
    this.props.getChildState({
      ...this.state,
      name,
      text
    });
  }

  onTextChanged = (e) => {
    const { items } = this.props;
    const value = e.target.value;
    let compareValue = value;
    if (value.includes(",")) {
      compareValue = value.split(",").slice(-1)[0];
    }
    let suggestions = [];
    if (compareValue.length > 0) {
      const regex = new RegExp(`${compareValue}`, "i");
      suggestions = items.sort().filter((v) => regex.test(v));
    }
    this.setState(() => ({ ...this.state, suggestions, text: value }));
    this.props.getChildState({
      ...this.state,
      text: value,
    });
  };

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

  suggestionSelected(value) {
    this.setState(() => ({
      text: value,
      suggestions: [],
    }));
    this.props.getChildState({
      ...this.state,
      text: value,
    });
  }

  render() {
    const { text } = this.state;
    return (
      <div className="AutoCompleteText">
        <input
          className="form-control"
          value={text}
          onChange={this.onTextChanged}
          type="text"
          placeholder={this.state.placeholder}
        />
        {this.renderSuggestions()}
      </div>
    );
  }
}
