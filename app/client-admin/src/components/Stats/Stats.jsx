import ReactApexChart from "react-apexcharts";
import React, { Component } from "react";
import { connect } from "react-redux";
import { experienceDict } from "../../utils/utils";
import {
  getExperienceStats,
  getGenderStats,
  getJobTypeStats,
  getSalaryStats,
  getMajorStats,
  getWorkPlaceStats,
} from "../../actions/stats.action";
import { getDataAutoComplete } from "../../actions/post.action";
import PropTypes from "prop-types";
import Banner from "../../assets/img/banner.jpg";
import AutoCompleteText from "../HOC/AutoCompleteText";

let pieOptions = {
  chart: {
    width: "75%",
    type: "pie",
  },
  title: {
    style: {
      fontSize: "18px",
    },
  },
  labels: [],
  responsive: [
    {
      breakpoint: 300,
      options: {
        chart: {
          width: "75%",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

let colOptions = {
  chart: {
    height: "75%",
    type: "bar",
    events: {
      click: function (chart, w, e) {},
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "45%",
      distributed: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
};

const donutOptions = {
  chart: {
    type: "donut",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: "75%",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

const treeMapOptions = {
  legend: {
    show: false,
  },
  chart: {
    height: "100%",
    type: "treemap",
  },
};

class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataAuto: null,
      experience: {
        series: [],
        labels: [],
      },
      gender: {
        series: [],
        labels: [],
      },
      jobType: {
        series: [],
        labels: [],
      },
      salary: {
        series: [],
        labels: [],
      },
      workPlaces: [],
      majors: [],
      workPlaceText: "",
      majorText: "",
      isLoading: true,
    };
  }

  getChildState = (data) => {
    if (data.name === "workplaces") {
      this.setState({
        ...this.state,
        workPlaceText: data.text,
      });
    } else if (data.name === "majors") {
      this.setState({
        ...this.state,
        majorText: data.text,
      });
    }
  };

  async componentDidMount() {
    await this.props.getExperienceStats();
    await this.props.getGenderStats();
    await this.props.getJobTypeStats();
    await this.props.getSalaryStats();
    await this.props.getMajorStats();
    await this.props.getWorkPlaceStats();
    await this.props.getDataAutoComplete();

    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      experience: {
        ...this.state.experience,
        series: Object.values(this.props.stats.experience),
        labels: Object.keys(this.props.stats.experience).map(
          (e) => experienceDict[e]
        ),
      },
      gender: {
        ...this.state.gender,
        series: Object.values(this.props.stats.gender),
        labels: Object.keys(this.props.stats.gender),
      },
      jobType: {
        ...this.state.jobType,
        series: Object.values(this.props.stats.jobType),
        labels: Object.keys(this.props.stats.jobType),
      },
      salary: {
        ...this.state.salary,
        series: Object.values(this.props.stats.salary),
        labels: Object.keys(this.props.stats.salary),
      },
      workPlaces: this.props.stats.workPlace.details,
      majors: this.props.stats.major.details,
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      let workPlaceTree = [],
        majorTree = [];
      const { workPlaces, majors, dataAuto } = this.state;

      const workPlaceLabels = Object.keys(workPlaces)
        .sort(function (a, b) {
          return workPlaces[b] - workPlaces[a];
        })
        .slice(0, 10);
      const majorLabels = Object.keys(majors)
        .sort(function (a, b) {
          return majors[b] - majors[a];
        })
        .slice(0, 10);

      workPlaceLabels.forEach((item) =>
        workPlaceTree.push({ x: item, y: workPlaces[item] })
      );
      majorLabels.forEach((item) =>
        majorTree.push({ x: item, y: majors[item] })
      );

      let experienceOptions = Object.assign({}, pieOptions);
      experienceOptions.labels = this.state.experience.labels;

      let genderOptions = Object.assign({}, pieOptions);
      genderOptions.labels = this.state.gender.labels;

      let jobTypeOptions = Object.assign({}, donutOptions);
      jobTypeOptions.labels = this.state.jobType.labels;

      let salaryOptions = colOptions;
      salaryOptions.xaxis.categories = this.state.salary.labels;

      return (
        <>
          <header
            className="site-header size-lg text-center"
            style={{
              backgroundImage: `url(${Banner})`,
            }}
          >
            <div class="container no-shadow">
              <h1 class="text-center">Thống kê</h1>
              <p class="lead">Xem thống kê về dữ liệu có trên hệ thống</p>
            </div>
          </header>
          <div style={{ height: 50 }}></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <header class="section-header">
                  <h2>Mô tả chung</h2>
                </header>
                <ul>
                  <li>
                    Hệ thống có tổng cộng{" "}
                    <strong>{this.state.dataAuto.numPosts}</strong> bài đăng
                    tuyển dụng
                  </li>
                  <li>
                    Hệ thống có tổng cộng{" "}
                    <strong>{this.state.dataAuto.numCompanies}</strong> công ty
                  </li>
                  <li>
                    Có tổng cộng{" "}
                    <strong>{this.props.stats.major.numMajors}</strong> ngành
                    nghề
                  </li>
                  <li>
                    Có tổng cộng{" "}
                    <strong>{this.props.stats.workPlace.numWorkPlaces}</strong>{" "}
                    địa điểm làm việc
                  </li>
                </ul>
              </div>
            </div>
            <header class="section-header">
              <h2>Các thống kê</h2>
            </header>
            <div className="row">
              <div className="col-xs-12 col-md-6 col-lg-6">
                <div className="row">
                  <h4 className="text-center">Thống kê theo kinh nghiệm</h4>
                  <div id="chart">
                    <ReactApexChart
                      options={experienceOptions}
                      series={this.state.experience.series}
                      type="pie"
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-6 col-lg-6">
                <div className="row">
                  <h4 className="text-center">Thống kê theo giới tính</h4>
                  <div id="chart">
                    <ReactApexChart
                      options={genderOptions}
                      series={this.state.gender.series}
                      type="pie"
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-6 col-lg-6">
                <div className="row">
                  <h4 className="text-center">
                    Thống kê theo hình thức làm việc
                  </h4>
                  <div id="chart">
                    <ReactApexChart
                      options={jobTypeOptions}
                      series={this.state.jobType.series}
                      type="donut"
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-6 col-lg-6">
                <div className="row">
                  <h4 className="text-center">Thống kê theo lương</h4>
                  <div id="chart">
                    <ReactApexChart
                      options={salaryOptions}
                      series={[{ data: this.state.salary.series }]}
                      type="bar"
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <header class="section-header">
              <h2>Ngành nghề</h2>
            </header>
            <div className="row">
              <h4>
                Nhập tên ngành nghề để xem số bài đăng tương ứng với ngành nghề
                bạn vừa nhập: {majors[this.state.majorText]}
                <AutoCompleteText
                  name="majors"
                  items={dataAuto.majors}
                  value=""
                  getChildState={this.getChildState}
                  placeholder="Ngành nghề"
                />
              </h4>
              <div style={{height: 30}}/>
              <h4 className="text-center">
                Top 15 ngành nghề có nhiều việc làm nhất
              </h4>
              <div id="chart">
                <ReactApexChart
                  options={treeMapOptions}
                  series={[{ data: majorTree }]}
                  type="treemap"
                  width={"100%"}
                />
              </div>
            </div>
            <header class="section-header">
              <h2>Địa điểm làm việc</h2>
            </header>
            <div className="row">
            <h4>
                Nhập tên ngành nghề để xem số bài đăng tương ứng với ngành nghề
                bạn vừa nhập: {workPlaces[this.state.workPlaceText]}
                <AutoCompleteText
                  name="workplaces"
                  items={dataAuto.workplaces}
                  value=""
                  getChildState={this.getChildState}
                  placeholder="Ngành nghề"
                />
              </h4>
              <div style={{height: 30}}/>
              <h4 className="text-center">
                Top 15 địa điểm làm việc có nhiều việc làm nhất
              </h4>
              <div id="chart">
                <ReactApexChart
                  options={treeMapOptions}
                  series={[{ data: workPlaceTree }]}
                  type="treemap"
                  width={"100%"}
                />
              </div>
            </div>
            <div style={{ height: 50 }}></div>
          </div>
        </>
      );
    }
  }
}

Stats.propTypes = {
  stats: PropTypes.object.isRequired,
  getExperienceStats: PropTypes.func.isRequired,
  getGenderTypeStats: PropTypes.func.isRequired,
  getJobTypeStats: PropTypes.func.isRequired,
  getSalaryStats: PropTypes.func.isRequired,
  getMajorStats: PropTypes.func.isRequired,
  getWorkPlaceStats: PropTypes.func.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ stats: state.stats, posts: state.posts });

const mapDispatchToProps = {
  getExperienceStats,
  getGenderStats,
  getJobTypeStats,
  getSalaryStats,
  getMajorStats,
  getWorkPlaceStats,
  getDataAutoComplete,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
