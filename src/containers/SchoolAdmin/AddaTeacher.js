import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SchoolAdmin/_Header';
import PageFooter from '../../Layouts/SchoolAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Jumbotron, FormControl } from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import SweetAlert from 'sweetalert2-react';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

class AddaTeacher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            staffid: '',
            phone: '',
            gender: 'Male',
            subjects: [],
            subjectsArray: [],
            password: '',
            selectedOption: '',
            successMessage: '',
            errorMessage: '',
            animationLoader: true,
            alert: false,
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.fetchSubjects();

    }

    showAlert = () => {

        swal(
            'Good job!',
            'The records was submited successfully!',
            'success'
        )

    };

    handleChangee = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.label}`);
    };

    resetForm = () => { // reset form
        this.setState({
            name: '',
            staffid: '',
            phone: '',
            gender: '',
            subjects: '',
            password: '',
        });
    };

    //Get Subjects

    fetchSubjects = () => { // fetch Subjects

        this.setState({errorMessage: false});

        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID + '/subjects', {  // HTTP GET REQUEST
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

    };
    // Get Subjects



    processAddTeacher = () => { // process add teacher

        var payload = { // payload object
            name: this.state.name,
            staffid: this.state.staffid,
            phone: this.state.phone,
            gender: this.state.gender,
            subjects: this.state.subjects,
            password: this.state.password,
        };

        console.log('Payload ', payload);

        // form validation

        if (payload.name === "") { // check name
            this.setState({errorMessage: 'Name field is required'});
            this.name.focus();
            return false;
        }

        if (payload.staffid === "") { // check staffid
            this.setState({errorMessage: 'Staff Id field is required'});
            this.staffid.focus();
            return false;
        }

        if (payload.phone === "") { // check phone
            this.setState({errorMessage: 'Phone field is required'});
            this.phone.focus();
            return false;
        }

        if (payload.gender === "") { // check gender
            this.setState({errorMessage: 'Gender field is required'});
            // this.gender.focus();
            return false;
        }

        if (payload.subjects === "") { // check subjects
            this.setState({errorMessage: 'Subjects field is required'});
            // this.subjects.focus();
            return false;
        }

        if (payload.password === "") { // check password
            this.setState({errorMessage: 'Password field is required'});
            this.password.focus();
            return false;
        }

        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation
        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID +'/teachers', {  // HTTP POST REQUEST
                    method: 'POST',
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

                            console.log('Successfully Inserted ',responseJson);

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

    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.processAddTeacher();
    };

    handleSelectChange = (event) => { // push/splice subject from select multi dropdown

        const target = event.target;
        const value = target.value;

        var subjectsArray = this.state.subjects;

        var i = subjectsArray.indexOf(value);

        if(i != -1) {
            subjectsArray.splice(i, 1);
        } else {
            subjectsArray.push(value);
        }

        // console.log(subjectsArray);

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

        const { selectedOption } = this.state;
        const value = selectedOption && selectedOption.value;

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
                                <h2>Add Teacher</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SchoolAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Teachers</strong>
                                    </li>
                                    <li className="active">
                                        <strong>Add Teacher</strong>
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
                                            <form className="form-horizontal" onSubmit={this.handleSubmit}>

                                                <div className="form-group"><label className="col-sm-2 control-label">Name</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="name"
                                                            ref={(input) => { this.name = input; }}
                                                            type="text"
                                                            value={this.state.name}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Name"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Staff Id</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="staffid"
                                                            ref={(input) => { this.staffid = input; }}
                                                            type="text"
                                                            value={this.state.staffid}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Staff Id"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Phone</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="phone"
                                                            ref={(input) => { this.phone = input; }}
                                                            type="text"
                                                            value={this.state.phone}
                                                            onChange={this.handleInputChange}
                                                            placeholder="e.g 0908978670"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Gender</label>

                                                    <div className="col-sm-10">
                                                        <FormControl
                                                            componentClass="select"
                                                            name="gender"
                                                            ref={(input) => { this.gender = input; }}
                                                            value={this.state.gender}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Male"
                                                        >
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </FormControl>
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Subjects</label>

                                                    <div className="col-sm-10">
                                                        <FormControl
                                                            componentClass="select"
                                                            name="subjects"
                                                            ref={(input) => { this.subjects = input; }}
                                                            value={this.state.subjects}
                                                            onChange={this.handleSelectChange}
                                                            placeholder="Subjects"
                                                            multiple
                                                        >
                                                            {this.state.subjectsArray.map(function(subject, i) {
                                                                return (
                                                                    <option value={subject._id}>{subject.name}</option>
                                                                );
                                                            })
                                                            }

                                                        </FormControl>
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group"><label className="col-sm-2 control-label">Password</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="password"
                                                            ref={(input) => { this.password = input; }}
                                                            type="password"
                                                            value={this.state.password}
                                                            onChange={this.handleInputChange}
                                                            placeholder="password"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group">
                                                    <div className="col-sm-4 col-sm-offset-2">
                                                        <NavLink className="btn btn-white" to="/SchoolAdmin">Cancel</NavLink>
                                                        <input type="submit" value="Add Teacher" className="btn btn-primary" />
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

export default AddaTeacher;