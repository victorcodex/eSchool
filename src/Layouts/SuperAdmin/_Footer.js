import React, { Component } from 'react';

class PageFooter extends Component {

    render() {
        return (
            <div>

                <div className="footer">
                    {/*<p>e-School System. All right reserved. &copy 2018</p>*/}
                    {/*<hr/>*/}
                    <div className="row">
                        <div className="col-md-6">
                            e-School App
                        </div>
                        <div className="col-md-6 text-right">
                            <small>All right reserved. Copyright © 2018</small>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}

export default PageFooter;