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

        }

    }

    printResult() {
        window.print();
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

                        {/*<Nav>*/}
                            {/*<NavLink to="/CheckResult" activeClassName='is-active' className="pages-a">Home</NavLink>*/}
                        {/*</Nav>*/}

                        <Nav pullRight>
                            <div onClick={this.printResult} className="logout-btn">
                                <i className="fa fa-print print-icon"></i> Print
                            </div>
                        </Nav>

                    </Navbar.Collapse>

                </Navbar>


            </div>
        );



    }

}

export default  Header;