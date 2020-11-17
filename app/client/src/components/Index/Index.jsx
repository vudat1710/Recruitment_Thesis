import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post.action";
import Search from "../Search/Search";
import HowItWork from "../../assets/img/job-vacancy.jpg"
import BGFact from "../../assets/img/bg-facts.jpg";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsDisplay: [],
    };
  }

  async componentDidMount() {
    await this.props.getPosts({ type: "home", limit: 5, attributes: ['postId', 'title', 'salary_type', 'valid_through'] });
    console.log(this.props.posts.postData)
    this.setState({
      ...this.state,
      postsDisplay: this.props.posts.postData,
    });
  }

  render() {
    const { postsDisplay } = this.state;
    let recentJobs =
      postsDisplay.length === 0 ? (
        <></>
      ) : (
        postsDisplay.map((post) => {
          let workplace = post.WorkPlaces.map(function(ele){ return ele.name;}).join(", ");
          return (
            <div className="col-xs-12">
              <a className="item-block" href="job-detail.html">
                <header>
                  <img src={post.Companies[0].img_url} alt="" />
                  <div className="hgroup">
                    <h4>{post.title}</h4>
                    <h5>{post.Companies[0].name}</h5>
                  </div>
                  <div className="header-meta">
                    <span className="location">{workplace}</span>
                    <span className="label label-success">{post.salary_type}</span>
                  </div>
                </header>
              </a>
            </div>
          );
        })
      );

    return (
      <>
        <Search />
        <main>
          <section className="bg-alt">
            <div className="container">
              <header className="section-header">
                <span>Gần nhất</span>
                <h2>Các công việc mới được cập nhật</h2>
                <p>Dưới đây là 5 công việc được cập nhật gần nhất trên hệ thống</p>
              </header>

              <div className="row item-blocks-condensed">{recentJobs}</div>

              <br />
              <br />
              <p className="text-center">
                <a className="btn btn-info" href="job-list.html">
                  Browse all jobs
                </a>
              </p>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="col-sm-12 col-md-6 hidden-xs hidden-sm">
                <br />
                <img
                  className="center-block"
                  src={HowItWork}
                  alt="how it works"
                />
              </div>

              <div className="col-sm-12 col-md-6">
                <header className="section-header text-left">
                  <span>Workflow</span>
                  <h2>How it works</h2>
                </header>

                <p className="lead">
                  Pellentesque et pulvinar orci. Suspendisse sed euismod purus.
                  Pellentesque nunc ex, ultrices eu enim non, consectetur
                  interdum nisl. Nam congue interdum mauris, sed ultrices augue
                  lacinia in. Praesent turpis purus, faucibus in tempor vel,
                  dictum ac eros.
                </p>
                <p>
                  Nulla quis felis et orci luctus semper sit amet id dui. Aenean
                  ultricies lectus nunc, vel rhoncus odio sagittis eu. Sed at
                  felis eu tortor mattis imperdiet et sed tortor. Nullam ac
                  porttitor arcu. Vivamus tristique elit id tempor lacinia.
                  Donec auctor at nibh eget tincidunt. Nulla facilisi. Nunc
                  condimentum dictum mattis.
                </p>

                <br />
                <br />
                <a className="btn btn-primary" href="page-typography.html">
                  Learn more
                </a>
              </div>
            </div>
          </section>

          <section className="bg-alt">
            <div className="container">
              <header className="section-header">
                <span>Categories</span>
                <h2>Popular jobs</h2>
                <p>Here's the most popular categories</p>
              </header>

              <div className="category-grid">
                <a href="#">
                  <i className="fa fa-laptop"></i>
                  <h6>Technology</h6>
                  <p>
                    Designer, Developer, IT Service, Front-end developer,
                    Project management
                  </p>
                </a>

                <a href="#">
                  <i className="fa fa-line-chart"></i>
                  <h6>Accounting</h6>
                  <p>
                    Finance, Tax service, Payroll manager, Book keeper, Human
                    resource
                  </p>
                </a>

                <a href="#">
                  <i className="fa fa-medkit"></i>
                  <h6>Medical</h6>
                  <p>Doctor, Nurse, Hospotal, Dental service, Massagist</p>
                </a>

                <a href="#">
                  <i className="fa fa-cutlery"></i>
                  <h6>Food</h6>
                  <p>Restaurant, Food service, Coffe shop, Cashier, Waitress</p>
                </a>

                <a href="#">
                  <i className="fa fa-newspaper-o"></i>
                  <h6>Media</h6>
                  <p>Journalism, Newspaper, Reporter, Writer, Cameraman</p>
                </a>

                <a href="#">
                  <i className="fa fa-institution"></i>
                  <h6>Government</h6>
                  <p>Federal, Law, Human resource, Manager, Biologist</p>
                </a>
              </div>

              <p className="text-center">
                <a className="btn btn-info" href="">
                  Browse all categories
                </a>
              </p>
            </div>
          </section>

          <section>
            <div className="container">
              <header className="section-header">
                <span>Plans</span>
                <h2>Pricing</h2>
                <p>Choose a plan that fits your needs</p>
              </header>

              <ul className="pricing">
                <li>
                  <h6>Basic Package</h6>
                  <div className="price">
                    <sup>$</sup>0<span>&nbsp;</span>
                  </div>
                  <hr />
                  <p>
                    <strong>1</strong> job posting
                  </p>
                  <p>
                    <strong>No</strong> featured job
                  </p>
                  <p>
                    <strong>5 days</strong> listing duration
                  </p>
                  <br />
                  <a className="btn btn-primary btn-block" href="#">
                    Select plan
                  </a>
                </li>

                <li>
                  <h6>Medium Package</h6>
                  <div className="price">
                    <sup>$</sup>5<sup>.99</sup>
                    <span>per month</span>
                  </div>
                  <hr />
                  <p>
                    <strong>5</strong> job posting
                  </p>
                  <p>
                    <strong>1</strong> featured job
                  </p>
                  <p>
                    <strong>30 days</strong> listing duration
                  </p>
                  <br />
                  <a className="btn btn-primary btn-block" href="#">
                    Select plan
                  </a>
                </li>

                <li>
                  <h6>Big Package</h6>
                  <div className="price">
                    <sup>$</sup>15<sup>.99</sup>
                    <span>per month</span>
                  </div>
                  <hr />
                  <p>
                    <strong>20</strong> job posting
                  </p>
                  <p>
                    <strong>5</strong> featured job
                  </p>
                  <p>
                    <strong>75 days</strong> listing duration
                  </p>
                  <br />
                  <a className="btn btn-primary btn-block" href="#">
                    Select plan
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section
            className="bg-img text-center"
            style={{
              backgroundImage: `url(${BGFact})`,
            }}
          >
            {/* <section className="bg-img text-center"> */}
            <div className="container">
              <h2>
                <strong>Subscribe</strong>
              </h2>
              <h6 className="font-alt">
                Get weekly top new jobs delivered to your inbox
              </h6>
              <br />
              <br />
              <form className="form-subscribe" action="#">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control input-lg"
                    placeholder="Your eamil address"
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-success btn-lg" type="submit">
                      Subscribe
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </section>
        </main>
      </>
    );
  }
}

Index.propTypes = {
  posts: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = {
  getPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
