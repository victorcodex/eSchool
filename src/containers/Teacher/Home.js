import React, { Component } from 'react';
import PageHeader from '../../Layouts/Teacher/_Header';
import PageFooter from '../../Layouts/Teacher/_Footer';

import { Jumbotron } from 'react-bootstrap';

class TeacherHome extends Component {

    constructor(props) {
        super(props);

        // GeneralMethods.chechCurrentUserToken(this.props, 'superadmin'); // check if User Token exist - redirects

    }


    render() {

        return (
            <div>

                <div className="bg-mainpage container">

                    {/*import page header*/}
                    <PageHeader />
                    {/*import page header*/}

                    <div className="Jumbotron-Dashboard">
                        <Jumbotron>
                            <h1>Teacher's Dashboard!</h1>
                            <p>
                                You can upload results etc.
                            </p>
                        </Jumbotron>
                    </div>


                    {/*import page footer*/}
                    <PageFooter />
                    {/*import page footer*/}

                </div>

            </div>
        );
    }


}

export default TeacherHome;
