import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/Teacher/_Header';
import PageFooter from '../../Layouts/Teacher/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Jumbotron, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import SweetAlert from 'sweetalert2-react';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

class UploadStudentResults extends Component {

    constructor(props) {
        super(props);
        this.state = {
            subject: 'English',
            class: 'JSS1',
            term: 'first',
            result: '',
            subjectsArray: [],
            successMessage: '',
            errorMessage: '',
            animationLoader: true,
            alert: false,
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.fetchSubjects();

    }

    promptUpdateAlert() { // CONFIRM UPDATE

        swal({
            title: 'Are you sure?',
            text: "Do you still want to upload this record",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Continue!'
        }).then((result) => {
            if (result.value) {
                this.processUploadResults();
            }
        })

    }

    showAlert = () => {

        swal(
            'Good job!',
            'The record was uploaded successfully!',
            'success'
        )

    };

    resetForm = () => { // reset form
        this.setState({
            subject: '',
            class: '',
            term: '',
            result: '',
        });
    };

    //Get Subjects

    fetchSubjects = () => { // fetch Subjects

        this.setState({errorMessage: false});

        localforage.getItem('TeacherToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_TEACHER_BASEURL + GeneralVariables.SCHOOL_ID + '/subjects', {  // HTTP GET REQUEST
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

                        this.setState({ subjectsArray: responseJson.subjects });

                        console.log('subjectsArray ', responseJson);

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
    // Get Subjects


    // processUploadResults
    processUploadResults = () => { // process add subject


        var payload = { // payload object
            subject: this.state.subject,
            class: this.state.class,
            term: this.state.term,
            result: this.result.files[0]
        };

        // form validation

        if (payload.subject === "") { // check subject
            this.setState({errorMessage: 'Subject field is required'});
            this.subject.focus();
            return false;
        }

        if (payload.class === "") { // check class
            this.setState({errorMessage: 'Class field is required'});
            this.class.focus();
            return false;
        }

        if (payload.term === "") { // check term
            this.setState({errorMessage: 'Term field is required'});
            this.term.focus();
            return false;
        }

        if (payload.result === "") { // check result
            this.setState({errorMessage: 'Result field is required'});
            this.result.focus();
            return false;
        }

        var data = new FormData();
        data.append('result', new Blob([this.result.files[0]]));
        data.append('subject', payload.subject);
        data.append('class', payload.class);
        data.append('term', payload.term);

        console.log('Payload ', data);

        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation

        localforage.getItem('TeacherToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_TEACHER_BASEURL + GeneralVariables.SCHOOL_ID +'/results', {  // HTTP POST REQUEST
                    method: 'POST',
                    body: data,
                    headers: {
                        'Authorization': 'Bearer '+value
                    },
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Kindly Contact the Admin or try again');
                    }
                }).then((responseJson) => { // returned JSON

                    if(responseJson) {

                        if(responseJson.status === 200) {

                            console.log('Result Uploaded ',responseJson);

                            this.setState({animationLoader: false}); // call loader animation

                            // this.setState({ successMessage: responseJson.message });

                            this.resetForm();

                            this.showAlert();

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



    };
    // processUploadResults


    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.promptUpdateAlert();
        // this.processUploadResults();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
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

                <SweetAlert
                    show={this.state.alert}
                    title="Demo"
                    text="SweetAlert in React"
                    onConfirm={() => this.setState({ alert: false })}
                />

                <div className="bg-mainpage container">

                    {/*import page header*/}
                    <PageHeader />
                    {/*import page header*/}

                    {/*Page content*/}

                    <Jumbotron>
                        <div className="row wrapper border-bottom white-bg page-heading">
                            <div className="col-lg-10">
                                <h2>Upload Results</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/Teacher">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Results</strong>
                                    </li>
                                    <li className="active">
                                        <strong>Upload Results</strong>
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
                                            <form className="form-horizontal" onSubmit={this.handleSubmit} encType="multipart/form-data">


                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Subject</label>

                                                    <div className="col-sm-10">
                                                        <FormControl
                                                            componentClass="select"
                                                            name="subject"
                                                            ref={(input) => { this.subject = input; }}
                                                            value={this.state.subject}
                                                            onChange={this.handleInputChange}
                                                            placeholder="English"
                                                        >
                                                            {this.state.subjectsArray.map(function(subject, i) {
                                                                return (
                                                                    <option value={subject.short}>{subject.name}</option>
                                                                );
                                                            })
                                                            }
                                                        </FormControl>
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Class</label>

                                                    <div className="col-sm-10">
                                                        <FormControl
                                                            componentClass="select"
                                                            name="class"
                                                            ref={(input) => { this.class = input; }}
                                                            value={this.state.class}
                                                            onChange={this.handleInputChange}
                                                            placeholder="SS1"
                                                        >
                                                            <option value="JSS1">JSS1</option>
                                                            <option value="JSS2">JSS2</option>
                                                            <option value="JSS3">JSS3</option>
                                                            <option value="SS1">SS1</option>
                                                            <option value="SS2">SS2</option>
                                                            <option value="SS3">SS3</option>
                                                        </FormControl>
                                                    </div>

                                                </div>


                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Term</label>

                                                    <div className="col-sm-10">
                                                        <FormControl
                                                            componentClass="select"
                                                            name="term"
                                                            ref={(input) => { this.term = input; }}
                                                            value={this.state.term}
                                                            onChange={this.handleInputChange}
                                                            placeholder="First Term"
                                                        >
                                                            <option value="first">First Term</option>
                                                            <option value="second">Second Term</option>
                                                            <option value="third">Third Term</option>
                                                        </FormControl>
                                                    </div>

                                                </div>


                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Result</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="result"
                                                            ref={(input) => { this.result = input; }}
                                                            type="file"
                                                            className="form-control"
                                                            accept=".csv, .xlsx, .xls"
                                                        />
                                                    </div>

                                                </div>


                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group">
                                                    <div className="col-sm-4 col-sm-offset-2">
                                                        <NavLink className="btn btn-white" to="/Teacher">Cancel</NavLink>
                                                        <input type="submit" value="Upload Results" className="btn btn-primary" />
                                                    </div>
                                                </div>
                                            </form>
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

export default UploadStudentResults;