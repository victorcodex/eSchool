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

class AddaSubject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            short: '',
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
            'The records was submitted successfully!',
            'success'
        )

    };


    resetForm = () => { // reset form
        this.setState({
            name: '',
            phone: ''
        });
    };


    processAddSubject = () => { // process add subject

        var payload = { // payload object
            name: this.state.name,
            short: this.state.short
        };

        console.log('Payload ', payload);

        // form validation

        if (payload.name === "") { // check name
            this.setState({errorMessage: 'Name field is required'});
            this.name.focus();
            return false;
        }

        if (payload.short === "") { // check short
            this.setState({errorMessage: 'Short name field is required'});
            this.short.focus();
            return false;
        }

        this.setState({errorMessage: false});
        this.setState({animationLoader: true}); // call loader animation

        // form validation
        localforage.getItem('SchoolAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID +'/subjects', {  // HTTP POST REQUEST
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
                        throw new Error('Kindly Contact the Admin or try again');
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
        this.processAddSubject();
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
                                <h2>Add Subject</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SchoolAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Subjects</strong>
                                    </li>
                                    <li className="active">
                                        <strong>Add Subject</strong>
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
                                                <div className="form-group"><label className="col-sm-2 control-label">short</label>

                                                    <div className="col-sm-10">
                                                        <input
                                                            name="short"
                                                            ref={(input) => { this.short = input; }}
                                                            type="text"
                                                            value={this.state.short}
                                                            onChange={this.handleInputChange}
                                                            placeholder="Chemistry"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                </div>


                                                <div className="hr-line-dashed"></div>
                                                <div className="form-group">
                                                    <div className="col-sm-4 col-sm-offset-2">
                                                        <NavLink className="btn btn-white" to="/SchoolAdmin">Cancel</NavLink>
                                                        <input type="submit" value="Add Subject" className="btn btn-primary" />
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

export default AddaSubject;