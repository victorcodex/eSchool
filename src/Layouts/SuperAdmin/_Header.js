import React, { Component } from 'react';
import { Route, NavLink, HashRouter, withRouter, Redirect } from "react-router-dom";

import schoollogo from '../../assets/img/schoologo.png'; // schoollogo

import { Navbar, Brand, Nav, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';

import localforage from 'localforage';

import GeneralMethods from '../../containers/generalMethods';
import GeneralApis from '../../containers/generalAPIs';
import GeneralVariables from '../../containers/generalVariables';

class PageHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false
        }

        this.chechCurrentUserToken();

    }

    logOut = () => {

        localforage.removeItem("SuperAdminToken");

        this.chechCurrentUserToken();

        console.log('About to logout');

        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SUPER_ADMIN_BASEURL, {  // HTTP DELETE REQUEST
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer '+value
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

                            console.log('Success');

                            // localforage.removeItem("SuperAdminToken");
                            //
                            // this.chechCurrentUserToken();

                        } else {
                            console.log(responseJson.message);
                            // this.setState({animationLoader: false}); // call loader animation
                            // this.setState({ errorMessage: responseJson.message });

                        }

                    } else {
                        console.log('Something went wrong. Kindly try again later');
                        // this.setState({animationLoader: false}); // call loader animation
                        // this.setState({ errorMessage: 'Something went wrong. Kindly try again later' });
                    }

                })
                    .catch((error) => {
                        console.log('Server ' + error);
                        // this.setState({animationLoader: false}); // call loader animation
                        // this.setState({ errorMessage: 'Server ' + error });

                    });




            } else {
                console.log('Failed 4');
                // this.setState({animationLoader: false}); // call loader animation
                // this.setState({ errorMessage: 'Something went wrong. Kindly Logout and Login again' });
            }

        });

    }

    chechCurrentUserToken = () => {
        localforage.getItem('SuperAdminToken', (err, value) => {

            if(value) {

            } else {
                this.setState({ isRedirect: true });
            }

        })
    }

    render() {

        if(this.state.isRedirect) { // check login status
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div>
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <NavLink to="/">
                            <Navbar.Brand>
                                <img className="logo" src={schoollogo} />
                            </Navbar.Brand>
                        </NavLink>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>

                        <Nav>
                            <NavLink to="/SuperAdmin" activeClassName='is-active' className="pages-a">Dashboard</NavLink>
                        </Nav>

                        <Nav>
                            <NavDropdown eventKey={3} title="Schools" id="basic-nav-dropdown">
                                <li>
                                    <NavLink to="/SuperAdminPage/AddNewSchool" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Add School
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SuperAdminPage/ViewSchools" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Schools
                                    </NavLink>
                                </li>
                            </NavDropdown>
                            <NavDropdown eventKey={3} title="Pin Codes" id="basic-nav-dropdown" activeClassName='is-active'>
                                <li>
                                    <NavLink to="/SuperAdminPage/CreatePinCodes" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Generate Pins
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SuperAdminPage/ViewPinCodes" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Pin Codes
                                    </NavLink>
                                </li>
                            </NavDropdown>
                        </Nav>
                        <Nav pullRight>
                            <div onClick={this.logOut} className="logout-btn">
                                Logout
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>


            </div>
        );
    }

}

export default  PageHeader;