import React, { Component } from 'react';
import { Route, NavLink, HashRouter } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralMethods from '../generalMethods';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SuperAdmin/_Header';
import PageFooter from '../../Layouts/SuperAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Navbar, Header, Brand, Nav, NavItem, NavDropdown, MenuItem, Button, Jumbotron, FormGroup, FormControl, ControlLabel, HelpBlock}
    from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/font-awesome/css/font-awesome.min.css';

import SweetAlert from 'sweetalert2-react';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

class CreatePinCodes extends Component {



    constructor(props) {
        super(props);
        this.state = {
            amount: '',
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
            'The Pins was generated successfully!',
            'success'
        )

    };


    resetForm = () => { // reset form

        this.setState({
            amount: '',
        });

    }

    processGeneratePins = () => { // process login

        var payload = { // payload object
            id: GeneralVariables.SCHOOL_ID,
            amount: this.state.amount,
        };

        console.log('Payload ', payload);

        // form validation
        //
        if (payload.amount === "") { // amount name
            this.setState({errorMessage: 'Quantity field is required'});
            this.amount.focus();
            return false;
        }

        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation
        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SUPER_ADMIN_BASEURL + '/codes', {  // HTTP POST REQUEST
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

                            console.log('Successfully Created ',responseJson);

                            this.setState({animationLoader: false}); // call loader animation

                            // this.setState({ successMessage: responseJson.message });

                            localforage.setItem("SuperAdminGeneratedCodes", JSON.stringify(responseJson)); // Store user Token

                            this.resetForm();

                            this.showAlert();

                            // this.props.history.push('/SchoolAdmin/AddaSubject'); // redirect to Teachers Dashboard

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


    handleSubmit = (event) => { // on form submit
        event.preventDefault();
        this.processGeneratePins();
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
                                <h2>Generate Pin Codes</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SuperAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Pin Codes</strong>
                                    </li>
                                    <li className="active">
                                        <strong>Generate Pin Codes</strong>
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

                                                <div className="form-group"><label className="col-sm-2 control-label">Quantity</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="amount"
                                                            ref={(input) => { this.amount = input; }}
                                                            type="number"
                                                            value={this.state.amount}
                                                            onChange={this.handleInputChange}
                                                            placeholder="e.g 100"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group">
                                                    <div className="col-sm-4 col-sm-offset-2">
                                                        <NavLink className="btn btn-white" to="/SuperAdmin">Cancel</NavLink>
                                                        <input type="submit" value="Generate" className="btn btn-primary" />
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

export default CreatePinCodes;