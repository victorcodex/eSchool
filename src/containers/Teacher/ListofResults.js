import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/Teacher/_Header';
import PageFooter from '../../Layouts/Teacher/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Header, Brand, Jumbotron } from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/css/plugins/dataTables/datatables.min.css';
import '../../assets/font-awesome/css/font-awesome.min.css';


class ListofResults extends Component {


    constructor(props) {
        super(props);
        this.state = {
            resultsArray: [],
            successMessage: '',
            errorMessage: '',
            animationLoader: true
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.fetchSubjects();

    }


    fetchSubjects = () => { // fetch Subjects



        this.setState({errorMessage: false});

        localforage.getItem('TeacherToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_TEACHER_BASEURL + GeneralVariables.SCHOOL_ID + '/results', {  // HTTP GET REQUEST
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer '+value
                    },
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Kindly Logout and login again. If the error still persist, then contact the Admin.');
                    }
                }).then((responseJson) => { // returned JSON

                    if(responseJson) {

                        if(responseJson.status === 200) {

                            this.setState({ resultsArray: responseJson.results });

                            console.log('resultsArray ', responseJson);

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

            } else {
                this.setState({animationLoader: false}); // call loader animation
                this.setState({ errorMessage: 'Something went wrong. Kindly Logout and Login again' });
            }

        });

    }


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
                        <div className="row wrapper border-bottom white-bg page-heading">
                            <div className="col-lg-10">
                                <h2>List of Results</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/Teacher">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Results</strong>
                                    </li>
                                    <li className="active">
                                        <strong>List of Results</strong>
                                    </li>
                                </ol>
                            </div>

                        </div>

                        <div className="wrapper wrapper-content animated fadeInRight">

                            <div className="row">

                                <div className="col-lg-4">
                                    <div className="ibox float-e-margins">

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="ibox float-e-margins">

                                        {this.state.successMessage ? (
                                            <div className="ibox-title">
                                                <h5 className="successMessage"> {this.state.successMessage} </h5>
                                            </div>
                                        ) : (
                                            (
                                                this.state.errorMessage ? (
                                                    <div className="ibox-title">
                                                        <h5 className="errorMessage"> {this.state.errorMessage} </h5>
                                                    </div>
                                                ) : (
                                                    <div className="ibox-title">
                                                        <h5>Pin Codes</h5>
                                                    </div>
                                                )
                                            )
                                        )}

                                        <div className="ibox-content">


                                            <div className="table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover dataTables-example">
                                                    <thead>
                                                    <tr>
                                                        <th>Subject</th>
                                                        <th>Class</th>
                                                        <th>Term</th>
                                                        <th>Session</th>
                                                        <th>student_id</th>
                                                        <th>Student Name</th>
                                                        <th>Test 1 Score</th>
                                                        <th>Test 2 Score</th>
                                                        <th>Exam Score</th>
                                                        <th>Total Score</th>
                                                        <th>Grade</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    {this.state.resultsArray.map(function(result, i) {

                                                        return (

                                                            <tr key={i} className="gradeA">
                                                                <td>{result.subject}</td>
                                                                <td>{result.class}</td>
                                                                <td>{result.term}</td>
                                                                <td>{result.session}</td>
                                                                <td>{result.student_id}</td>
                                                                <td>{result.name}</td>
                                                                <td>{result.test1}</td>
                                                                <td>{result.test2}</td>
                                                                <td>{result.exam}</td>
                                                                <td>{result.total}</td>
                                                                <td>{result.grade}</td>
                                                            </tr>

                                                        );

                                                    })
                                                    }

                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th>Subject</th>
                                                        <th>Class</th>
                                                        <th>Term</th>
                                                        <th>Session</th>
                                                        <th>student_id</th>
                                                        <th>Student Name</th>
                                                        <th>Test 1 Score</th>
                                                        <th>Test 2 Score</th>
                                                        <th>Exam Score</th>
                                                        <th>Total Score</th>
                                                        <th>Grade</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default ListofResults;