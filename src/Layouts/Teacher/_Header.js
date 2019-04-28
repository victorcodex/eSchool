import React, { Component } from 'react';
import { Route, NavLink, HashRouter, withRouter, Redirect } from "react-router-dom";

import schoollogo from '../../assets/img/schoologo.png'; // schoollogo

import { Navbar, Brand, Nav, NavDropdown, MenuItem, Jumbotron } from 'react-bootstrap';

import localforage from 'localforage';

import GeneralMethods from '../../containers/generalMethods';
import GeneralApis from '../../containers/generalAPIs';
import GeneralVariables from '../../containers/generalVariables';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false
        }

        this.chechCurrentUserToken();

    }

    logOut = () => {

        localforage.removeItem("TeacherToken");

        this.chechCurrentUserToken();

        console.log('About to logout');

        localforage.getItem('TeacherToken', (err, value) => {

            if(value) {

                fetch( GeneralApis.API_SCHOOL_ADMIN_BASEURL + GeneralVariables.SCHOOL_ID, {  // HTTP DELETE REQUEST
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

                            // localforage.removeItem("TeacherToken");
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
        localforage.getItem('TeacherToken', (err, value) => {

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
                            <NavLink to="/Teacher" activeClassName='is-active' className="pages-a">Dashboard</NavLink>
                        </Nav>

                        <Nav>
                            <NavDropdown eventKey={3} title="Subjects" id="basic-nav-dropdown" activeClassName='is-active'>
                                <li>
                                    <NavLink to="/TeacherPage/ListofSubjects" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Subjects
                                    </NavLink>
                                </li>
                            </NavDropdown>
                            <NavDropdown eventKey={3} title="Results" id="basic-nav-dropdown">
                                <li>
                                    <NavLink to="/TeacherPage/UploadStudentResults" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Upload Results
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/TeacherPage/ListofResults" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Results
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

export default  Header;