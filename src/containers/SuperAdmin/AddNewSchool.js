import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';

import PageHeader from '../../Layouts/SuperAdmin/_Header';
import PageFooter from '../../Layouts/SuperAdmin/_Footer';
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


class AddNewSchool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            school_slug: '',
            principal_name: '',
            principal_phone: '',
            principal_email: '',
            address: '',
            admin_name: '',
            admin_email: '',
            admin_phone: '',
            admin_password: '',
            logo: '',
            successMessage: '',
            errorMessage: '',
            animationLoader: false,
            alert: false,
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects
    }

    promptUpdateAlert() { // CONFIRM UPDATE

        swal({
            title: 'Are you sure?',
            text: "Do you still want to create this school",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Continue!'
        }).then((result) => {
            if (result.value) {
                this.processCreateSchool();
            }
        })

    }

    showAlert = () => {

        swal(
            'Good job!',
            'The school was created successfully!',
            'success'
        )

    };

    resetForm = () => { // reset form

        this.setState({
            name: '',
            school_slug: '',
            principal_name: '',
            principal_phone: '',
            principal_email: '',
            address: '',
            admin_name: '',
            admin_email: '',
            admin_phone: '',
            admin_password: '',
            result: '',
        });

    };

    processCreateSchool = () => { // process Create School

        var payload = { // payload object
            name: this.state.name,
            school_slug: this.state.school_slug,
            principal_name: this.state.principal_name,
            principal_phone: this.state.principal_phone,
            principal_email: this.state.principal_email,
            address: this.state.address,
            admin_name: this.state.admin_name,
            admin_email: this.state.admin_email,
            admin_phone: this.state.admin_phone,
            admin_password: this.state.admin_password,
            logo: this.logo.files[0]
        };

        console.log('Payload ', payload);

        // form validation
        //
        if (payload.name === "") { // check name
            this.setState({errorMessage: 'Name field is required'});
            this.name.focus();
            return false;
        }

        if (payload.school_slug === "") { // check school_slug
            this.setState({errorMessage: 'School slug field is required'});
            this.school_slug.focus();
            return false;
        }

        if (payload.principal_name === "") { // check principal_name
            this.setState({errorMessage: 'Principal name field is required'});
            this.principal_name.focus();
            return false;
        }

        if (payload.principal_phone === "") { // check principal_phone
            this.setState({errorMessage: 'Principal phone field is required'});
            this.principal_phone.focus();
            return false;
        }

        if (payload.principal_email === "") { // check principal_email
            this.setState({errorMessage: 'Principal email field is required'});
            this.principal_email.focus();
            return false;
        }

        if (!GeneralMethods.validateEmail(payload.principal_email)) { // validate email
            this.setState({ errorMessage: 'Invalid Email Address' });
            this.principal_email.focus();
            return false;
        }

        // if( payload.principal_email.length > 0 ) { // if has value, validate email
        //     if (!GeneralMethods.validateEmail(payload.principal_email)) { // validate email
        //         this.setState({ errorMessage: 'Invalid Email Address' });
        //         this.principal_email.focus();
        //         return false;
        //     }
        // }

        if (payload.address === "") { // check address
            this.setState({errorMessage: 'Address field is required'});
            this.address.focus();
            return false;
        }

        if (payload.admin_name === "") { // check admin_name
            this.setState({errorMessage: 'Admin name field is required'});
            this.admin_name.focus();
            return false;
        }

        if (payload.admin_email === "") { // check admin_email
            this.setState({errorMessage: 'Admin email field is required'});
            this.admin_email.focus();
            return false;
        }

        if (!GeneralMethods.validateEmail(payload.admin_email)) { // validate email
            this.setState({ errorMessage: 'Invalid Email Address' });
            this.admin_email.focus();
            return false;
        }

        if (payload.admin_phone === "") { // check admin_phone
            this.setState({errorMessage: 'Admin phone field is required'});
            this.admin_phone.focus();
            return false;
        }

        if (payload.admin_password === "") { // check admin_password
            this.setState({errorMessage: 'Admin password field is required'});
            this.admin_password.focus();
            return false;
        }

        if (this.logo.files.length < 1) { // check Logo
            this.setState({errorMessage: 'Logo field is required'});
            // this.students.focus();
            return false;
        }


        var data = new FormData();
        data.append('logo', new Blob([this.logo.files[0]]));
        data.append('name', payload.name);
        data.append('school_slug', payload.school_slug);
        data.append('principal_name', payload.principal_name);
        data.append('principal_phone', payload.principal_phone);
        data.append('principal_email', payload.principal_email);
        data.append('address', payload.address);
        data.append('admin_name', payload.admin_name);
        data.append('admin_email', payload.admin_email);
        data.append('admin_phone', payload.admin_phone);
        data.append('admin_password', payload.admin_password);

        console.log('Payload ', data);

        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation
        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

            fetch( GeneralApis.API_SUPER_ADMIN_BASEURL + '/schools', {  // HTTP POST REQUEST
                method: 'POST',
                body: data,
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

                        console.log('Successfully Inserted ',responseJson);

                        this.setState({animationLoader: false}); // call loader animation

                        // this.setState({ successMessage: responseJson.message });

                        // localforage.setItem("Added_Schhol", JSON.stringify(responseJson));

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
        this.promptUpdateAlert();
        // this.processCreateSchool();
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
                            <h2>Add School</h2>
                            <ol className="breadcrumb">
                                <li>
                                    <NavLink to="/SuperAdmin/">Dashboard</NavLink>
                                </li>
                                <li className="active">
                                    <strong>Add School</strong>
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

                                            <div className="form-group"><label className="col-sm-2 control-label">School Name</label>

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
                                            <div className="form-group"><label className="col-sm-2 control-label">School slug</label>

                                                <div className="col-sm-10">
                                                    <input
                                                        name="school_slug"
                                                        ref={(input) => { this.school_slug = input; }}
                                                        type="text"
                                                        value={this.state.school_slug}
                                                        onChange={this.handleInputChange}
                                                        placeholder="e.g trinity"
                                                        className="form-control"
                                                    />
                                                </div>

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Principal Name</label>

                                                <div className="col-sm-10">
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

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Principal phone</label>

                                                <div className="col-sm-10">
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

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Principal email</label>

                                                <div className="col-sm-10">
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

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Address</label>

                                                <div className="col-sm-10">
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

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Admin name</label>

                                                <div className="col-sm-10">
                                                    <input
                                                        name="admin_name"
                                                        ref={(input) => { this.admin_name = input; }}
                                                        type="text"
                                                        value={this.state.admin_name}
                                                        onChange={this.handleInputChange}
                                                        placeholder="David Ju"
                                                        className="form-control"
                                                    />
                                                </div>

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Admin email</label>

                                                <div className="col-sm-10">
                                                    <input
                                                        name="admin_email"
                                                        ref={(input) => { this.admin_email = input; }}
                                                        type="email"
                                                        value={this.state.admin_email}
                                                        onChange={this.handleInputChange}
                                                        placeholder="admin@trinity.com"
                                                        className="form-control"
                                                    />
                                                </div>

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Admin phone</label>

                                                <div className="col-sm-10">
                                                    <input
                                                        name="admin_phone"
                                                        ref={(input) => { this.admin_phone = input; }}
                                                        type="text"
                                                        value={this.state.admin_phone}
                                                        onChange={this.handleInputChange}
                                                        placeholder="08098765432"
                                                        className="form-control"
                                                    />
                                                </div>

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Admin password</label>

                                                <div className="col-sm-10">
                                                    <input
                                                        name="admin_password"
                                                        ref={(input) => { this.admin_password = input; }}
                                                        type="password"
                                                        value={this.state.admin_password}
                                                        onChange={this.handleInputChange}
                                                        placeholder="adminpassword"
                                                        className="form-control"
                                                    />
                                                </div>

                                            </div>

                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group"><label className="col-sm-2 control-label">Logo</label>

                                                <div className="col-sm-10">
                                                    <input
                                                        name="logo"
                                                        ref={(input) => { this.logo = input; }}
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                    />
                                                </div>

                                            </div>



                                            <div className="hr-line-dashed"></div>
                                            <div className="form-group">
                                                <div className="col-sm-4 col-sm-offset-2">
                                                    <NavLink className="btn btn-white" to="/SuperAdmin">Cancel</NavLink>
                                                    <input type="submit" value="Add School" className="btn btn-primary" />
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

export default AddNewSchool;