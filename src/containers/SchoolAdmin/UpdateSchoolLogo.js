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

class UpdateSchoolLogo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logo: '',
            successMessage: '',
            errorMessage: '',
            animationLoader: false,
            alert: false,
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects
    }

    showAlert = () => {

        swal(
            'Good job!',
            'The record was uploaded successfully!',
            'success'
        )

    };

    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.processUpdateLogo();
    };


    processUpdateLogo = (event) => { // process update logo

        if (this.logo.files.length < 1) { // check logo
            this.setState({errorMessage: 'Logo field is required'});
            return false;
        }

        var data = new FormData();
        data.append('logo', new Blob([this.logo.files[0]]));


        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation
        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID +'/logo', {  // HTTP POST REQUEST
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
                                <h2>Update School Logo</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SchoolAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>School</strong>
                                    </li>
                                    <li className="active">
                                        <strong>Update School Logo</strong>
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
                                                        <NavLink className="btn btn-white" to="/SchoolAdmin">Cancel</NavLink>
                                                        <input type="submit" value="Update Logo" className="btn btn-primary" />
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

export default UpdateSchoolLogo;