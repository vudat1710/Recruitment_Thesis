/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <h6>Về trang web</h6>
              <p className="text-justify">
                Ứng dụng giúp tìm kiếm công việc theo vị trí người tìm việc.
                Điều đó giúp người dùng tìm được các công việc gần chỗ ở, tiện
                đi lại, giảm bớt được nhiều chi phí và có thể check thông tin
                bất cứ lúc nào!
              </p>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Job Recruitment</h6>
              <ul className="footer-links">
                <li>
                  <a href="page-about.html">About us</a>
                </li>
                <li>
                  <a href="page-typography.html">How it works</a>
                </li>
                <li>
                  <a href="page-faq.html">Help center</a>
                </li>
                <li>
                  <a href="page-typography.html">Privacy policy</a>
                </li>
                <li>
                  <a href="page-contact.html">Contact us</a>
                </li>
              </ul>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Các công việc gợi ý</h6>
              <ul className="footer-links">
                <li>
                  <a href="job-list.html">Front-end developer</a>
                </li>
                <li>
                  <a href="job-list.html">Android developer</a>
                </li>
                <li>
                  <a href="job-list.html">iOS developer</a>
                </li>
                <li>
                  <a href="job-list.html">Full stack developer</a>
                </li>
                <li>
                  <a href="job-list.html">Project administrator</a>
                </li>
              </ul>
            </div>
          </div>

          <hr />
        </div>

        <div className="container">
          <div className="row">
            {/* <div className="col-md-8 col-sm-6 col-xs-12">
              <p className="copyright-text">
                Copyrights &copy; 2016 All Rights Reserved by{" "}
                <a href="http://themeforest.net/user/shamsoft">ShaMSofT</a>.
              </p>
            </div> */}

            <div className="col-md-12 col-sm-12 col-xs-12">
              <ul className="social-icons">
                <li>
                  <a className="facebook" href="#">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a className="twitter" href="#">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a className="dribbble" href="#">
                    <i className="fa fa-dribbble"></i>
                  </a>
                </li>
                <li>
                  <a className="linkedin" href="#">
                    <i className="fa fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a className="instagram" href="#">
                    <i className="fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
