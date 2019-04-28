import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/CheckResult/_Header';
import PageFooter from '../../Layouts/CheckResult/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Jumbotron, Grid, Row, Col, Clearfix } from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';


import passport from '../../assets/img/passport.jpg'; // passport
import passportbackup from '../../assets/img/passport.jpg'; // passport
import signature from '../../assets/img/signature.png'; // signature
import schoologo from '../../assets/img/schoologo.png'; // schoologo


class CheckResultHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            short: '',
            studentid: '',
            code: '',
            studentResultsArray: [],
            studentResults: [],
            showForm: true,
            successMessage: '',
            errorMessage: '',
            animationLoader: false,
            // studentResultsArray:
            // [{
            //     "status": 200,
            //     "message": "Your result",
            //     "results": [
            //         {
            //             "subject": "English Language",
            //             "grade": "B3"
            //         },
            //         {
            //             "subject": "Mathematics",
            //             "grade": "B3"
            //         }
            //     ],
            //     "term": "second",
            //     "session": "2017/2018",
            //     "student": {
            //         "id": "AB19991",
            //         "name": "Matha Aborin",
            //         "passport": passport,
            //         "gender": "male"
            //     },
            //     "school": {
            //         "name": "Trinity Greatest Schools",
            //         "address": "21 New Avenue Street, Lagos",
            //         "logo": schoologo,
            //         "principal_signature": signature
            //     }
            // }],
            // studentResults: [
            //     {
            //         "subject": "English Language",
            //         "grade": "B3"
            //     },
            //     {
            //         "subject": "Mathematics",
            //         "grade": "B3"
            //     },
            //     {
            //         "subject": "Physics",
            //         "grade": "A1"
            //     },
            //     {
            //         "subject": "Biology",
            //         "grade": "C5"
            //     },
            //     {
            //         "subject": "Health Science",
            //         "grade": "B3"
            //     },
            //     {
            //         "subject": "History",
            //         "grade": "A1"
            //     },
            //     {
            //         "subject": "Social Studies",
            //         "grade": "A1"
            //     },
            //     {
            //         "subject": "Geography",
            //         "grade": "B3"
            //     }
            // ],
        };


        this.setState({ studentResultsArray: this.state.studentResultsArray });
        this.setState({ studentResults: this.state.studentResults });

        console.log('studentResultsArray ' + this.state.studentResultsArray);

    }


    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.processFetchResults();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };


    processFetchResults = () => { // fetch Subjects

        if (this.state.studentid === "" || this.state.studentid === null) { // check studentid
            this.setState({errorMessage: 'Student ID field is required'});
            this.studentid.focus();
            return false;
        }

        if (this.state.code === "" || this.state.code === null) { // check code
            this.setState({errorMessage: 'Pin code field is required'});
            this.code.focus();
            return false;
        }

        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

            fetch( GeneralApis.API_BASEURL + GeneralVariables.SCHOOL_ID + '/result?studentid=' + this.state.studentid + '&code=' + this.state.code, {  // HTTP GET REQUEST
                method: 'GET',
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Kindly Logout and login again. If the error still persist, then contact the Admin.');
                }
            }).then((responseJson) => { // returned JSON

                if(responseJson) {

                    if(responseJson.status === 200) {

                        this.setState({ studentResultsArray: [responseJson] });
                        this.setState({ studentResults: responseJson.results });
                        this.setState({ showForm: false }); // hide input Form

                        console.log('studentResultsArray ', this.state.studentResultsArray);

                        this.setState({animationLoader: false}); // call loader animation

                        this.setState({ successMessage: responseJson.message });

                    } else {
                        this.setState({animationLoader: false}); // call loader animation
                        this.setState({ errorMessage: responseJson.message });

                    }

                } else {
                    this.setState({animationLoader: false}); // call loader animation
                    this.setState({ errorMessage: 'Something went wrong. Kindly try again later' });
                }

            })
                .catch((error) => {

                    this.setState({animationLoader: false}); // call loader animation
                    this.setState({ errorMessage: 'Server ' + error });

                });


    };



    render() {

        if(this.state.animationLoader) { // loading animation
            return (
                <div>
                    <ProcessingAnimation/>
                </div>
            );
        }

        return (
            <div>

                <div className="bg-mainpage container">

                    {/*import page header*/}
                    <PageHeader />
                    {/*import page header*/}


                    {/*Page content*/}

                    <Jumbotron>

                        {this.state.showForm ? (
                            <span></span>
                        ) : (
                            <div className="row wrapper border-bottom white-bg page-heading result-bg">
                                <div className="col-lg-12 result-bg-middle">

                                    <div className="wrapper wrapper-content animated fadeInRight result-bg-top">

                                        <div className="row">

                                            <div className="col-lg-4">
                                                <div className="ibox float-e-margins">

                                                </div>
                                            </div>
                                        </div>


                                        {this.state.studentResultsArray.map(function (result,) {

                                        return (
                                            <div>

                                                <Row className="show-grid">

                                                    <Col xs={2} md={2} className="rs-img-cols">

                                                        <h4>
                                                            {/*School logo:*/}
                                                            <img src={result.school.logo} className="result-imgs" alt="school logo" height="42" width="42" />
                                                        </h4><hr />
                                                        <h4>Principal's signature:
                                                            <img src={result.school.principal_signature} className="result-imgs" alt="principal_signature" height="42" width="42" />
                                                        </h4>

                                                    </Col>

                                                    <Col xs={8} md={8} className="result-header-text">

                                                        <h2 className="re-sc-title">
                                                            {result.school.name} <br />
                                                            <p className="re-sc-address">{result.school.address}</p>
                                                        </h2>

                                                        <ol className="breadcrumb">

                                                            <p>Student Names: {result.student.name}</p>
                                                            <p>Student Id: {result.student.id} </p>
                                                            <p>Gender: {result.student.gender}</p>

                                                            <hr />

                                                            <p> <span>Term: {result.term}</span> -
                                                                <span> Session: {result.session}</span></p>

                                                        </ol>

                                                        <p>Result Sheet</p>

                                                    </Col>

                                                    <Col xs={2} md={2} className="rs-img-cols">

                                                        <h4>
                                                            {/*Passport:*/}
                                                            <img src={result.student.passport}
                                                                 onError={(e)=>{e.target.src=passportbackup}}
                                                                 className="result-imgs"
                                                                 alt="Student passport"
                                                                 height="42"
                                                                 width="42" />
                                                        </h4>

                                                    </Col>

                                                </Row>

                                            </div>
                                        );

                                    })
                                    }

                                    <div className="table-responsive">
                                        <table
                                            className="table table-striped table-bordered table-hover dataTables-example">
                                            <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Grade</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {this.state.studentResults.map(function(result, i) {

                                                return (

                                                    <tr key={i} className="gradeA">
                                                        <td> {result.subject} </td>
                                                        <td> {result.grade} </td>
                                                    </tr>

                                                );

                                            })}

                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Grade</th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                </div>
                                </div>

                            </div>
                        )
                        }

                        <div className="wrapper wrapper-content animated fadeInRight">

                            <div className="row">

                                <div className="col-lg-4">
                                    <div className="ibox float-e-margins">

                                    </div>
                                </div>
                            </div>

                            {this.state.showForm ? (
                                // Show Form

                                <div className="row">
                                    <div className="col-lg-12 result-col">

                                        <div className="ibox float-e-margins">
                                            <div className="ibox-title">

                                                {this.state.successMessage ? (
                                                    <h5 className="successMessage"> {this.state.successMessage} </h5>
                                                ) : (
                                                    (
                                                        this.state.errorMessage ? (
                                                            <h5 className="errorMessage"> {this.state.errorMessage} </h5>
                                                        ) : (
                                                            <h5>All fields are required</h5>
                                                        )
                                                    )
                                                )}

                                            </div>


                                            <div className="ibox-content">

                                            <form className="form-horizontal" onSubmit={this.handleSubmit}>

                                                <div className="form-group"><label className="col-sm-2 control-label">Student ID</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="studentid"
                                                            ref={(input) => { this.studentid = input; }}
                                                            type="text"
                                                            value={this.state.studentid}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Student ID"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Pin Code</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="code"
                                                            ref={(input) => { this.code = input; }}
                                                            type="text"
                                                            value={this.state.code}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Pin Code"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group">
                                                    <div className="col-sm-4 col-sm-offset-2">
                                                        <NavLink className="btn btn-white" to="/SchoolAdmin">Cancel</NavLink>
                                                        <input type="submit" value="Check Result" className="btn btn-primary" />
                                                    </div>
                                                </div>
                                            </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    // Show Form
                                ) : (
                                    // Show Result
                                    <span></span>
                                    // Show Result
                                )}

                        </div>
                    </Jumbotron>

                    {/*Page content*/}



                    {/*import page footer*/}
                    <PageFooter />
                    {/*import page footer*/}

                </div>

            </div>
        );
    }


}

export default CheckResultHome;
