import React, { Component } from 'react';

class Footer extends Component {

    render() {
        return (
            <div>

                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        Copyright e-School App
                    </div>
                    <div className="col-md-6 text-right">
                        <small>© 2018</small>
                    </div>
                </div>

            </div>
        );
    }

}

export default Footer;