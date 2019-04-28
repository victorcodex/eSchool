import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { Header, Brand, Button, Jumbotron, Modal } from 'react-bootstrap';
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SuperAdmin/_Header';
import PageFooter from '../../Layouts/SuperAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/css/plugins/dataTables/datatables.min.css';
import '../../assets/font-awesome/css/font-awesome.min.css';


class ViewSchools extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            show: false,
            schoolsArray: [],
            name: '',
            school_slug: '',
            principal_name: '',
            principal_phone: '',
            principal_email: '',
            address: '',
            successMessage: '',
            errorMessage: '',
            modalSuccessMessage: '',
            modalErrorMessage: '',
            animationLoader: true
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.processFetchSchools();

    }

    handleModalClose = () => {
        this.setState({ show: false });
    };

    handleModalShow = (name, school_slug, principal_name, principal_phone, principal_email, address) => { // get school data

        if(school_slug) {
            this.setState(
                {
                    show: true,
                    name: name,
                    school_slug: school_slug,
                    principal_name: principal_name,
                    principal_phone: principal_phone,
                    principal_email: principal_email,
                    address: address,
                });
        }

    };

    resetForm = () => { // reset form

        this.setState({
            name: '',
            principal_name: '',
            principal_phone: '',
            principal_email: '',
            address: '',
        });

    };

    // Update school
    processUpdateSchool = () => {

        var payload = { // payload object
            name: this.state.name,
            principal_name: this.state.principal_name,
            principal_phone: this.state.principal_phone,
            principal_email: this.state.principal_email,
            address: this.state.address,
        };

        console.log('Payload ', payload);

        // form validation
        //
        if (payload.name === "") { // check name
            this.setState({modalErrorMessage: 'Name field is required'});
            this.name.focus();
            return false;
        }

        if (payload.principal_name === "") { // check principal_name
            this.setState({modalErrorMessage: 'Principal name field is required'});
            this.principal_name.focus();
            return false;
        }

        if (payload.principal_phone === "") { // check principal_phone
            this.setState({modalErrorMessage: 'Principal phone field is required'});
            this.principal_phone.focus();
            return false;
        }

        if (payload.principal_email === "") { // check principal_email
            this.setState({modalErrorMessage: 'Principal email field is required'});
            this.principal_email.focus();
            return false;
        }

        if (!GeneralMethods.validateEmail(payload.principal_email)) { // validate email
            this.setState({ modalErrorMessage: 'Invalid Email Address' });
            this.principal_email.focus();
            return false;
        }

        if (payload.address === "") { // check address
            this.setState({modalErrorMessage: 'Address field is required'});
            this.address.focus();
            return false;
        }

        this.setState({modalErrorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation

        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SUPER_ADMIN_BASEURL + '/schools/' + this.state.school_slug, {  // HTTP POST REQUEST
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

                            this.processFetchSchools(); // refetch schools

                            this.handleModalClose();

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
    // Update school

    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.processUpdateSchool();
    };

    handleInputChange = (event) => { // on input value change
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    // Fetch schools
    processFetchSchools = () => { // process Fetch Schools

        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SUPER_ADMIN_BASEURL + '/schools/' + GeneralVariables.FETCH_SCHOOL_QUANTITY, {  // HTTP POST REQUEST
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer '+value,
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

                            this.setState({ schoolsArray: responseJson.schools });

                            console.log('schoolsArray ', this.state.schoolsArray);

                            this.setState({animationLoader: false}); // call loader animation

                            this.setState({ successMessage: responseJson.message });

                            // localforage.setItem("SuperAdminGeneratedCodes", JSON.stringify(responseJson)); // Store user Token

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
    // Fetch schools


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
                                <h2>View Schools</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SuperAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Schools</strong>
                                    </li>
                                    <li className="active">
                                        <strong>View Schools</strong>
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
                                                        <h5>List of Schools</h5>
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
                                                        <th>School Slug</th>
                                                        <th className="tb-action-col">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    {this.state.schoolsArray.map( (schools, i) => {

                                                        return (

                                                            <tr key={i} className="gradeA">
                                                                <td>{schools.name}</td>
                                                                <td>{schools.slug}</td>
                                                                <td className="center">
                                                                    <button onClick={(param) =>
                                                                        this.handleModalShow(
                                                                            schools.name,
                                                                            schools.slug,
                                                                            schools.principal_name,
                                                                            schools.principal_phone,
                                                                            schools.principal_email,
                                                                            schools.address
                                                                        )}
                                                                        className="btn alvie-blue edit-btn"
                                                                        type="button">
                                                                        <i className="fa fa-pencil"></i> Edit
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
                                                        <th>Name</th>
                                                        <th>School Slug</th>
                                                        <th>Action</th>
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
                                <label>Address</label>
                                <input
                                    name="address"
                                    ref={(input) => { this.address = input; }}
                                    type="text"
                                    value={this.state.address}
                                    onChange={this.handleInputChange}
                                    placeholder="No 4. Kim Street Lagos"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Principal Name</label>
                                <input
                                    name="principal_name"
                                    ref={(input) => { this.principal_name = input; }}
                                    type="text"
                                    value={this.state.principal_name}
                                    onChange={this.handleInputChange}
                                    placeholder="Ade Williams"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Principal Email</label>
                                <input
                                    name="principal_email"
                                    ref={(input) => { this.principal_email = input; }}
                                    type="email"
                                    value={this.state.principal_email}
                                    onChange={this.handleInputChange}
                                    placeholder="ade@trinity.com"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Principal Phone</label>
                                <input
                                    name="principal_phone"
                                    ref={(input) => { this.principal_phone = input; }}
                                    type="text"
                                    value={this.state.principal_phone}
                                    onChange={this.handleInputChange}
                                    placeholder="0908978670"
                                    className="form-control"
                                />
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

export default ViewSchools;