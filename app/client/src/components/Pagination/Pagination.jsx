import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchPosts } from "../../actions/post.action";

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalPages: 0,
      currentPage: 1,
      searchData: {},
      resultPosts: {},
    };
  }

  async onClickPage(page, searchData) {
    searchData.page = page;
    await this.props.searchPosts(searchData);
    this.setState({
      ...this.state,
      currentPage: page,
      resultPosts: this.props.posts.searchResults,
    });
    this.props.getChildState({
      ...this.state,
      resultPosts: this.props.posts.searchResults,
    });
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      totalPages: this.props.totalPages,
      currentPage: this.props.currentPage,
      searchData: this.props.searchData,
    });
  }

  render() {
    const { totalPages, currentPage, searchData } = this.state;
    let element = [];
    if (totalPages <= 5) {
        new Array(totalPages).map((page) => {
          if (page === currentPage) {
            element.push(
              <li className="active">
                <a onClick={() => this.onClickPage(page, searchData)}>{page}</a>
              </li>
            );
          } else {
            element.push(
              <li>
                <a onClick={() => this.onClickPage(page, searchData)}>{page}</a>
              </li>
            );
          }
        });
    } else {
        
      if (currentPage <= 5) {
        const newArr = range(1, 5);
        newArr.map((page) => {
          if (page === currentPage) {
            element.push(
              <li className="active">
                <a onClick={() => this.onClickPage(page, searchData)}>{page}</a>
              </li>
            );
          } else {
            element.push(
              <li>
                <a onClick={() => this.onClickPage(page, searchData)}>{page}</a>
              </li>
            );
          }
        });
        element.push(
          <li>
            <a
              aria-label="Next"
              onClick={() => {this.onClickPage(currentPage+1, searchData)}}
            >
              <i className="ti-angle-right"></i>
            </a>
          </li>
        );
      } else {
        element.push(
          <li>
            <a
              aria-label="Previous"
              onClick={() => this.onClickPage(currentPage - 2, searchData)}
            >
              <i className="ti-angle-left"></i>
            </a>
          </li>
        );
        let nextPagEnd = currentPage + 3;
        if (currentPage + 3 > totalPages) {
          nextPagEnd = totalPages;
        }
        new range(currentPage - 1, nextPagEnd).map((page) => {
          if (page === currentPage) {
            element.push(
              <li className="active">
                <a onClick={() => this.onClickPage(page, searchData)}>{page}</a>
              </li>
            );
          } else {
            element.push(
              <li>
                <a onClick={() => this.onClickPage(page, searchData)}>{page}</a>
              </li>
            );
          }
        });

        if (currentPage + 1 <= totalPages) {
          element.push(
            <li>
              <a
                aria-label="Next"
                onClick={() => this.onClickPage(currentPage + 1, searchData)}
              >
                <i className="ti-angle-right"></i>
              </a>
            </li>
          );
        }
      }
    }
    return <ul className="pagination">{element}</ul>;
  }
}

Pagination.propTypes = {
  posts: PropTypes.object.isRequired,
  searchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ posts: state.posts });

const mapDispatchToProps = { searchPosts };

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
