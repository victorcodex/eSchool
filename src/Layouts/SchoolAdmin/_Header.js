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

        localforage.removeItem("SchoolAdminToken");

        this.chechCurrentUserToken();

        console.log('About to logout');

        localforage.getItem('SchoolAdminToken', (err, value) => {

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

                            // localforage.removeItem("SchoolAdminToken");
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
        localforage.getItem('SchoolAdminToken', (err, value) => {

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
                            <NavLink to="/SchoolAdmin" activeClassName='is-active' className="pages-a">Dashboard</NavLink>
                        </Nav>

                        <Nav>
                            <NavDropdown eventKey={3} title="Teachers" id="basic-nav-dropdown">
                                <li>
                                    <NavLink to="/SchoolAdminPage/AddaTeacher" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Add Teacher
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SchoolAdminPage/UploadTeachers" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Upload Teachers
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SchoolAdminPage/ListOfTeachers" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Teachers
                                    </NavLink>
                                </li>
                            </NavDropdown>
                            <NavDropdown eventKey={3} title="Students" id="basic-nav-dropdown" activeClassName='is-active'>
                                <li>
                                    <NavLink to="/SchoolAdminPage/AddStudentsRecord" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Add Student
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SchoolAdminPage/ListofStudents" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Students
                                    </NavLink>
                                </li>
                            </NavDropdown>
                            <NavDropdown eventKey={3} title="Subjects" id="basic-nav-dropdown" activeClassName='is-active'>
                                <li>
                                    <NavLink to="/SchoolAdminPage/AddaSubject" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Add Subject
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SchoolAdminPage/ListofSubjects" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        View Subjects
                                    </NavLink>
                                </li>
                            </NavDropdown>
                            <NavDropdown eventKey={3} title="School" id="basic-nav-dropdown" activeClassName='is-active'>
                                <li>
                                    <NavLink to="/SchoolAdminPage/UpdateSchoolLogo" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Update logo
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SchoolAdminPage/UpdateSchoolSignature" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Update Signature
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/SchoolAdminPage/UpdateGrade" role="menuitem" tabindex="-1" activeClassName='is-active' className="pages-a">
                                        Update Grade
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