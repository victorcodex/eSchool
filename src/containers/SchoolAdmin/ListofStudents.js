import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { Header, Brand, Button, Jumbotron, Modal, FormControl } from 'react-bootstrap';
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SchoolAdmin/_Header';
import PageFooter from '../../Layouts/SchoolAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/css/plugins/dataTables/datatables.min.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import SweetAlert from 'sweetalert2-react';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';


class ListofStudents extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            studentsArray: [],
            studentId: '',
            firstname: '',
            lastname: '',
            class: '',
            gender: 'male',
            successMessage: '',
            errorMessage: '',
            modalSuccessMessage: '',
            modalErrorMessage: '',
            animationLoader: true,
            alert: false,
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.processFetchStudents();

    }

    promptUpdateAlert() { // CONFIRM UPDATE

        swal({
            title: 'Are you sure?',
            text: "Do you still want to update this record",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Continue!'
        }).then((result) => {
            if (result.value) {
                this.processUpdateStudent();
            }
        })

    }

    showAlert = () => {

        swal(
            'Good job!',
            'The records was updated successfully!',
            'success'
        )

    };


    handleModalClose = () => {
        this.setState({ show: false });
    };

    handleModalShow = (studentId, firstname, lastname, studentclass, gender) => { // get student data

        if(studentId) {
            this.setState(
                {
                    studentId: studentId,
                    firstname: firstname,
                    lastname: lastname,
                    class: studentclass,
                    gender: gender,
                    show: true,
                });
        }

    };

    // Update student
    processUpdateStudent = () => {

        var payload = { // payload object
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            class: this.state.class,
            gender: this.state.gender
        };

        console.log('Payload ', payload);

        // form validation
        //
        if (payload.firstname === "") { // check firstname
            this.setState({modalErrorMessage: 'First Name field is required'});
            this.firstname.focus();
            return false;
        }

        if (payload.lastname === "") { // check lastname
            this.setState({modalErrorMessage: 'Last Name field is required'});
            this.lastname.focus();
            return false;
        }

        if (payload.class === "") { // check class
            this.setState({modalErrorMessage: 'Class field is required'});
            this.class.focus();
            return false;
        }

        if (payload.gender === "" || payload.gender === "Select gender") { // check gender
            this.setState({modalErrorMessage: 'Gender field is required'});
            // this.gender.focus();
            return false;
        }

        this.setState({modalErrorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation

        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID +'/students/' + this.state.studentId, {  // HTTP POST REQUEST
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

                            this.processFetchStudents(); // refetch schools

                            this.handleModalClose();

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
    // Update student


    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.promptUpdateAlert();
        // this.processUpdateStudent();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };


    // Fetch Students

    processFetchStudents = () => { // fetch Students

        this.setState({errorMessage: false});

        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID + '/students', {  // HTTP GET REQUEST
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

                            this.setState({ studentsArray: responseJson.students });

                            console.log('studentsArray ', responseJson);

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
    // Fetch Students


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
                                <h2>List of Students</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SchoolAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Students</strong>
                                    </li>
                                    <li className="active">
                                        <strong>List of Students</strong>
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
                                                        <h5>List of Students</h5>
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
                                                        <th>Student ID</th>
                                                        <th>Surname</th>
                                                        <th>First Name</th>
                                                        <th>Class</th>
                                                        <th>Gender</th>
                                                        <th className="tb-action-col">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    {this.state.studentsArray.map( (students, i) => {

                                                        return (

                                                            <tr key={i} className="gradeA">
                                                                <td>{students.id}</td>
                                                                <td>{students.firstname}</td>
                                                                <td>{students.lastname}</td>
                                                                <td>{students.class}</td>
                                                                <td>{students.gender}</td>
                                                                <td className="center">
                                                                    <button onClick={(param) =>
                                                                        this.handleModalShow(
                                                                            students.id,
                                                                            students.firstname,
                                                                            students.lastname,
                                                                            students.class,
                                                                            students.gender
                                                                        )}
                                                                            className="btn alvie-blue edit-btn"
                                                                            type="button">
                                                                        <i className="fa fa-pencil"></i>
                                                                        Edit
                                                                    </button>
                                                                    {/*<a href="edit_log.html">*/}
                                                                    {/*<button className="btn alvie-blue delete-btn" type="button">*/}
                                                                    {/*<i className="fa fa-paste"></i>*/}
                                                                    {/*Delete*/}
                                                                    {/*</button>*/}
                                                                    {/*</a>*/}
                                                                </td>
                                                            </tr>

                                                        );

                                                    })
                                                    }

                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th>Student ID</th>
                                                        <th>Surname</th>
                                                        <th>First Name</th>
                                                        <th>Class</th>
                                                        <th>Gender</th>
                                                        <th className="tb-action-col">Action</th>
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

                    {/*Update Modal*/}

                    <Modal show={this.state.show} onHide={this.handleModalClose}>
                        <form onSubmit={this.handleSubmit}>

                            <Modal.Header closeButton>
                                <Modal.Title>Update - {this.state.firstname}'s info</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                {this.state.modalSuccessMessage ? (
                                    <h5 className="successMessage"> {this.state.modalSuccessMessage} </h5>
                                ) : (
                                    (
                                        this.state.modalErrorMessage ? (
                                            <h5 className="errorMessage"> {this.state.modalErrorMessage} </h5>
                                        ) : (
                                            <h5>All fields are required</h5>
                                        )
                                    )
                                )}

                                <hr />

                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        name="firstname"
                                        ref={(input) => { this.firstname = input; }}
                                        type="text"
                                        value={this.state.firstname}
                                        onChange={this.handleInputChange}
                                        placeholder="First Name"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        name="lastname"
                                        ref={(input) => { this.lastname = input; }}
                                        type="text"
                                        value={this.state.lastname}
                                        onChange={this.handleInputChange}
                                        placeholder="Last Name"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Class</label>
                                    {/*<input*/}
                                        {/*name="principal_name"*/}
                                        {/*ref={(input) => { this.class = input; }}*/}
                                        {/*type="text"*/}
                                        {/*value={this.state.class}*/}
                                        {/*onChange={this.handleInputChange}*/}
                                        {/*placeholder="Student Class"*/}
                                        {/*className="form-control"*/}
                                    {/*/>*/}
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

                                <div className="hr-line-dashed"></div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <FormControl
                                        componentClass="select"
                                        name="gender"
                                        ref={(input) => { this.gender = input; }}
                                        value={this.state.gender}
                                        onChange={this.handleInputChange}
                                        placeholder="Male"
                                        className="form-control"
                                    >
                                        <option defaultValue="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>

                                    </FormControl>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.handleModalClose}>Close</Button>
                                <input type="submit" value="Save" className="btn btn-success" />
                            </Modal.Footer>

                        </form>

                    </Modal>
                    {/*Update Modal*/}

                    {/*Page content*/}


                    {/*import page footer*/}
                    <PageFooter />
                    {/*import page footer*/}


                </div>

            </div>
        );
    }

}

export default ListofStudents;