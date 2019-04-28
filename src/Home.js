import React, { Component } from "react";
import { Route, NavLink, BrowserRouter, HashRouter } from "react-router-dom";
import './App.css';
import GeneralVariables from './containers/generalVariables';

import logo from './assets/img/logo.png';
import schoollogo from './assets/img/schoologo.png';

import Header from './Layouts/_Header';
import Footer from './Layouts/_Footer';



class MainHome extends Component {

    render() {

        return (
            <div>

                <div className="bg animated fadeInDown">
                    <div className="col-md-6 app-landing-intro">


                        <p></p>

                        {/*<h2 className=""></h2>*/}


                        <p className="app-landing-intro-p">
                            <img className="logo" src={schoollogo} alt="logo" />
                        </p>


                        <h1 className="school-title">Trinity School, Lagos</h1>

                        {/*<p className="app-landing-intro-p">*/}
                            {/*School Result Processing System*/}
                        {/*</p>*/}

                    </div>

                    <div id="status-box-container">

                        <NavLink to='/SuperAdminPage/Login' className="rmlink">
                            <div className="status-box status-box1">
                                <i className="fa fa-cog fa-user-icon"></i>
                                <span>Super Admin Portal </span>
                            </div>
                        </NavLink>

                        <NavLink to={'/SchoolAdminPage/Login/' + GeneralVariables.SCHOOL_ID}  className="rmlink">
                            <div className="status-box status-box2">
                                <i className="fa fa-user fa-user-icon"></i>
                                <span>School Admin Portal </span>
                            </div>
                        </NavLink>

                        <NavLink to={'/TeacherPage/Login/' + GeneralVariables.SCHOOL_ID} className="rmlink">
                            <div className="status-box status-box3">
                                <i className="fa fa-user-circle fa-user-icon"></i>
                                <span>Teachers Portal </span>
                            </div>
                        </NavLink>

                        <NavLink to='/CheckResult' className="rmlink">
                            <div className="status-box status-box4">
                                <i className="fa fa-wpforms fa-user-icon"></i>
                                <span>Check Result </span>
                            </div>
                        </NavLink>

                    </div>

                </div>


            </div>
        );
    }
}

export default MainHome;