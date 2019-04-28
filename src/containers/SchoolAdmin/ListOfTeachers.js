import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { Header, Brand, Button, Jumbotron, Modal, FormControl } from 'react-bootstrap';
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SchoolAdmin/_Header';
import PageFooter from '../../Layouts/SchoolAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';


import localforage from 'localforage';

// import '../../assets/css/style.css';
// import '../../assets/css/bootstrap.min.css';
// import '../../assets/css/animate.css';
// import '../../assets/css/plugins/dataTables/datatables.min.css';
// import '../../assets/font-awesome/css/font-awesome.min.css';
import SweetAlert from 'sweetalert2-react';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';


class ListOfTeachers extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            teachersArray: [],
            subjectsArray: [],
            id: '',
            name: '',
            staffid: '',
            phone: '',
            subjects: [],
            gender: 'Male',
            successMessage: '',
            errorMessage: '',
            modalSuccessMessage: '',
            modalErrorMessage: '',
            animationLoader: true,
            alert: false,
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.processFetchTeachers();
        this.processFetchSubjects();
        // this.showAlert();

    }

    handleModalClose = () => {
        this.setState({ show: false });
    };

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
                this.processUpdateTeacher();
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

    handleModalShow = (id, name, staffid, phone, subjects, gender) => { // get teacher data

        if(id) {
            this.setState(
            {
                show: true,
                id: id,
                name: name,
                staffid: staffid || '',
                phone: phone,
                subjects: subjects,
                gender: gender,
            });
        }

    };

    resetForm = () => { // reset form

        this.setState({
            id: '',
            name: '',
            staffid: '',
            phone: '',
            subjects: '',
            gender: '',
        });

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



    //Get Subjects

    processFetchSubjects = () => { // fetch Subjects

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

    // Update teacher
    processUpdateTeacher = () => {

        var payload = { // payload object
            name: this.state.name,
            staffid: this.state.staffid,
            phone: this.state.phone,
            subjects: this.state.subjects,
            gender: this.state.gender
        };

        console.log('Payload ', payload);

        // form validation
        //
        if (this.state.id === "") { // check id
            this.setState({modalErrorMessage: 'Something went wrong. This teacher does not have a teacher id. Kindly contact the admin'});
            // this.name.focus();
            return false;
        }

        if (payload.name === "") { // check name
            this.setState({modalErrorMessage: 'Name field is required'});
            this.name.focus();
            return false;
        }

        if (payload.staffid === "") { // check staffid
            this.setState({modalErrorMessage: 'Staff Id field is required'});
            this.staffid.focus();
            return false;
        }

        if (payload.phone === "") { // check phone
            this.setState({modalErrorMessage: 'Phone field is required'});
            this.phone.focus();
            return false;
        }

        if (payload.subjects === "") { // check subjects
            this.setState({modalErrorMessage: 'Subjects field is required'});
            // this.subjects.focus();
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

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID + '/teachers/' + this.state.id, {  // HTTP POST REQUEST
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

                            console.log('Successfully Updated ', responseJson);

                            this.setState({animationLoader: false}); // call loader animation

                            this.processFetchTeachers(); // refresh teachers

                            this.handleModalClose();

                            // this.setState({ successMessage: responseJson.message });

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
    // Update teacher

    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.promptUpdateAlert();
        // this.processUpdateTeacher();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };


    processFetchTeachers = () => { // fetch Teachers

        this.setState({errorMessage: false});
        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID + '/teachers', {  // HTTP GET REQUEST
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

                            this.setState({ teachersArray: responseJson.teachers });

                            console.log('teachersArray ', responseJson);

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
                                <h2>List of Teachers</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SchoolAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Teachers</strong>
                                    </li>
                                    <li className="active">
                                        <strong>List of Teachers</strong>
                                    </li>
                                </ol>

                                {/*<button onClick={() => this.setState({ alert: true })}>Alert</button>*/}

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
                                                        <h5>List of Teachers</h5>
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
                                                        <th>Name</th>
                                                        <th>Staff Id</th>
                                                        <th>Phone</th>
                                                        <th>Subjects</th>
                                                        <th>Gender</th>
                                                        <th className="tb-action-col">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    {this.state.teachersArray.map( (teachers, i) => {

                                                        return (

                                                            <tr key={i} className="gradeA">
                                                                <td>{teachers.name}</td>
                                                                <td>{teachers.staffid}</td>
                                                                <td>{teachers.phone}</td>
                                                                <td>
                                                                {teachers.subjects.map(function(subject, i) {
                                                                    return (
                                                                        <span> {subject}  | </span>
                                                                    );
                                                                })}
                                                                </td>

                                                                <td>{teachers.gender}</td>

                                                                <td className="center">

                                                                    {teachers ? (
                                                                        <button onClick={(param) =>
                                                                            this.handleModalShow(
                                                                                teachers.id,
                                                                                teachers.name,
                                                                                teachers.staffid,
                                                                                teachers.phone,
                                                                                teachers.subjects,
                                                                                teachers.gender
                                                                            )}
                                                                            className="btn alvie-blue edit-btn"
                                                                            type="button">
                                                                            <i className="fa fa-pencil"></i> Edit
                                                                        </button>
                                                                    ) : (
                                                                        <span></span>
                                                                    )}




                                                                </td>
                                                            </tr>

                                                        );

                                                    })
                                                    }

                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Staff Id</th>
                                                        <th>Phone</th>
                                                        <th>Subjects</th>
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
                                <Modal.Title>Update - {this.state.name}</Modal.Title>
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
                                    <label>Name</label>
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

                                <div className="form-group">
                                    <label>Staff Id</label>
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

                                <div className="form-group">
                                    <label>Phone</label>
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
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>

                                    </FormControl>
                                </div>

                                <div className="form-group">
                                    <label>Subjects</label>
                                    <FormControl
                                        componentClass="select"
                                        name="subjects"
                                        ref={(input) => { this.subjects = input; }}
                                        value={this.state.subjects}
                                        onChange={this.handleSelectChange}
                                        placeholder="Subjects"
                                        multiple
                                        className="form-control"
                                    >
                                        {this.state.subjectsArray.map(function(subject, i) {
                                            return (
                                                <option value={subject._id}>{subject.name}</option>
                                            );
                                        })
                                        }

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

export default ListOfTeachers;