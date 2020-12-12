import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class CompareComp extends Component {
  render() {
    let compareList = this.props.posts.compareList;
    return compareList.length < 2 ? (
      <a className="links">So sánh việc làm ({compareList.length})</a>
    ) : (
      <Link className="links" to="/compare">
        So sánh việc làm ({compareList.length})
      </Link>
    );
  }
}

const mapStateToProps = state => ({
    posts: state.posts,
});
    
const mapDispatchToProps = {  };
    
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CompareComp);

