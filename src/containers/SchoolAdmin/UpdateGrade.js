import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SchoolAdmin/_Header';
import PageFooter from '../../Layouts/SchoolAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Jumbotron } from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import SweetAlert from 'sweetalert2-react';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

class UpdateGrade extends Component {

    constructor(props) {
        super(props);
        this.state = {
            A1: '',
            B2: '',
            B3: '',
            B4: '',
            C5: '',
            C6: '',
            D7: '',
            E8: '',
            F9: '',
            successMessage: '',
            errorMessage: '',
            animationLoader: false,
            alert: false,
        };

        this.processFetchGrades(); // fetch grades
    }

    promptUpdateAlert() { // CONFIRM UPDATE

        swal({
            title: 'Are you sure?',
            text: "Do you still want to update this records",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Continue!'
        }).then((result) => {
            if (result.value) {
                this.processUpdateGrades();
            }
        })

    }

    showAlert = () => {

        swal(
            'Good job!',
            'The records was uploaded successfully!',
            'success'
        )

    };

    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.promptUpdateAlert();
        // this.processUpdateGrades();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    // fetch Subjects

    processFetchGrades = () => {

        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {


                this.setState({errorMessage: false});
                this.setState({animationLoader: true}); // call loader animation


                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID + '/grades', {  // HTTP GET REQUEST
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

                            this.setState({
                                gradesArray: [responseJson.grades],
                                A1: responseJson.grades.A1,
                                B2: responseJson.grades.B2,
                                B3: responseJson.grades.B3,
                                B4: responseJson.grades.B4,
                                C5: responseJson.grades.C5,
                                C6: responseJson.grades.C6,
                                D7: responseJson.grades.D7,
                                E8: responseJson.grades.E8,
                                F9: responseJson.grades.F9,
                            });

                            console.log('gradesArray ', responseJson);

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

    };

    // fetch grades

    processUpdateGrades = (event) => { // process update logo

        var payload = { // payload object
            A1: this.state.A1,
            B2: this.state.B2,
            B3: this.state.B3,
            B4: this.state.B4,
            C5: this.state.C5,
            C6: this.state.C6,
            D7: this.state.D7,
            E8: this.state.E8,
            F9: this.state.F9,
            slug: GeneralVariables.SCHOOL_ID
        };

        if (payload.A1 === "") { // check A1
            this.setState({errorMessage: 'A1 field is required'});
            this.A1.focus();
            return false;
        }

        if (payload.B2 === "") { // check B2
            this.setState({errorMessage: 'B2 field is required'});
            this.B2.focus();
            return false;
        }

        if (payload.B3 === "") { // check B3
            this.setState({errorMessage: 'B3 field is required'});
            this.B3.focus();
            return false;
        }

        if (payload.B4 === "") { // check B4
            this.setState({errorMessage: 'B4 field is required'});
            this.B4.focus();
            return false;
        }

        if (payload.C5 === "") { // check C5
            this.setState({errorMessage: 'C5 field is required'});
            this.C5.focus();
            return false;
        }

        if (payload.C6 === "") { // check C6
            this.setState({errorMessage: 'C6 field is required'});
            this.C6.focus();
            return false;
        }

        if (payload.D7 === "") { // check D7
            this.setState({errorMessage: 'D7 field is required'});
            this.D7.focus();
            return false;
        }

        if (payload.E8 === "") { // check E8
            this.setState({errorMessage: 'E8 field is required'});
            this.E8.focus();
            return false;
        }

        if (payload.F9 === "") { // check F9
            this.setState({errorMessage: 'F9 field is required'});
            this.F9.focus();
            return false;
        }

        console.log('Grades ', payload);

        this.setState({modalErrorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation

        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID +'/grades', {  // HTTP POST REQUEST
                    method: 'PUT',
                    body: JSON.stringify(payload),
                    headers: {
                        'Authorization': 'Bearer '+value,
                        'Content-Type': 'application/json'
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

                            console.log('Successfully Updated ',responseJson);

                            this.setState({animationLoader: false}); // call loader animation

                            this.processFetchGrades(); // refetch grades

                            this.showAlert();

                        } else {
                            this.setState({animationLoader: false}); // call loader animation
                            this.setState({ modalErrorMessage: responseJson.message });

                        }

                    } else {
                        this.setState({animationLoader: false}); // call loader animation
                        this.setState({ modalErrorMessage: 'Something went wrong. Kindly try again later' });
                    }

                })
                    .catch((error) => {

                        this.setState({animationLoader: false}); // call loader animation
                        this.setState({ modalErrorMessage: 'Server ' + error });

                    });




            } else {
                this.setState({animationLoader: false}); // call loader animation
                this.setState({ modalErrorMessage: 'Something went wrong. Kindly Logout and Login again' });
            }

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
                                <h2>Update Grade</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SchoolAdmin">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>School</strong>
                                    </li>
                                    <li className="active">
                                        <strong>Update Grade</strong>
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

                                            <form ref="uploadForm" className="form-horizontal" encType="multipart/form-data" onSubmit={this.handleSubmit}>

                                                <div className="form-group">

                                                    <div className="form-group"><label className="col-sm-2 control-label">A1</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="A1"
                                                                ref={(input) => { this.A1 = input; }}
                                                                type="text"
                                                                value={this.state.A1}
                                                                onChange={this.handleInputChange}
                                                                placeholder="A1"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="form-group"><label className="col-sm-2 control-label">B2</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="B2"
                                                                ref={(input) => { this.B2 = input; }}
                                                                type="text"
                                                                value={this.state.B2}
                                                                onChange={this.handleInputChange}
                                                                placeholder="B2"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="form-group"><label className="col-sm-2 control-label">B3</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="B3"
                                                                ref={(input) => { this.B3 = input; }}
                                                                type="text"
                                                                value={this.state.B3}
                                                                onChange={this.handleInputChange}
                                                                placeholder="B3"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="form-group"><label className="col-sm-2 control-label">B4</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="B4"
                                                                ref={(input) => { this.B4 = input; }}
                                                                type="text"
                                                                value={this.state.B4}
                                                                onChange={this.handleInputChange}
                                                                placeholder="B4"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="form-group"><label className="col-sm-2 control-label">C5</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="C5"
                                                                ref={(input) => { this.C5 = input; }}
                                                                type="text"
                                                                value={this.state.C5}
                                                                onChange={this.handleInputChange}
                                                                placeholder="C5"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="form-group"><label className="col-sm-2 control-label">C6</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="C6"
                                                                ref={(input) => { this.C6 = input; }}
                                                                type="text"
                                                                value={this.state.C6}
                                                                onChange={this.handleInputChange}
                                                                placeholder="C6"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="form-group"><label className="col-sm-2 control-label">D7</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="D7"
                                                                ref={(input) => { this.D7 = input; }}
                                                                type="text"
                                                                value={this.state.D7}
                                                                onChange={this.handleInputChange}
                                                                placeholder="D7"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="form-group"><label className="col-sm-2 control-label">E8</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="E8"
                                                                ref={(input) => { this.E8 = input; }}
                                                                type="text"
                                                                value={this.state.E8}
                                                                onChange={this.handleInputChange}
                                                                placeholder="E8"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>


                                                    <div className="form-group"><label className="col-sm-2 control-label">F9</label>

                                                        <div className="col-sm-10">
                                                            <input
                                                                name="F9"
                                                                ref={(input) => { this.F9 = input; }}
                                                                type="text"
                                                                value={this.state.F9}
                                                                onChange={this.handleInputChange}
                                                                placeholder="F9"
                                                                className="form-control"
                                                            />
                                                        </div>

                                                    </div>


                                                </div>


                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group">
                                                    <div className="col-sm-4 col-sm-offset-2">
                                                        <NavLink className="btn btn-white" to="/SchoolAdmin">Cancel</NavLink>
                                                        <input type="submit" value="Update Grade" className="btn btn-primary" />
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

export default UpdateGrade;