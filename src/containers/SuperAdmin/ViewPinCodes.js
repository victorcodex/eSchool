import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import GeneralApis from '../generalAPIs';
import GeneralVariables from '../generalVariables';

import PageHeader from '../../Layouts/SuperAdmin/_Header';
import PageFooter from '../../Layouts/SuperAdmin/_Footer';
import ProcessingAnimation from '../../Layouts/_ProcessingAnimation';

import { Header, Brand, Jumbotron } from 'react-bootstrap';

import localforage from 'localforage';

import '../../assets/css/style.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/css/plugins/dataTables/datatables.min.css';
import '../../assets/font-awesome/css/font-awesome.min.css';


class ViewPinCodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pinCodesArray: [],
            successMessage: '',
            errorMessage: '',
            animationLoader: true
        };

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

        this.fetchPinCodes();

    }


    fetchPinCodes = () => { // fetch Pin Codes

        this.setState({errorMessage: false});
        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SUPER_ADMIN_BASEURL + '/codes/' + GeneralVariables.FETCH_PINS_QUANTITY, {  // HTTP GET REQUEST
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

                            this.setState({ pinCodesArray: responseJson.codes });

                            console.log('pinCodesArray ', this.state.pinCodesArray);

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
                                <h2>View Pin Codes</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        <NavLink to="/SuperAdmin/">Dashboard</NavLink>
                                    </li>
                                    <li className="active">
                                        <strong>Pin Codes</strong>
                                    </li>
                                    <li className="active">
                                        <strong>View Pin Codes</strong>
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
                                                        <h5>Pin Codes</h5>
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
                                                        <th>Code</th>
                                                        <th>Date</th>
                                                        <th>School Slug</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                        {this.state.pinCodesArray.map(function(pincodes, i) {

                                                           return (

                                                                <tr key={i} className="gradeA">
                                                                    <td>{pincodes.code}</td>
                                                                    <td>{pincodes.date}</td>
                                                                    <td>{pincodes.slug}</td>
                                                                </tr>

                                                               );

                                                           })
                                                        }

                                                    </tbody>
                                                <tfoot>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Date</th>
                                                    <th>School Slug</th>
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

                    {/*Page content*/}


                    {/*import page footer*/}
                    <PageFooter />
                    {/*import page footer*/}


                </div>

            </div>
        );
    }


}

export default ViewPinCodes;