import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Contact extends React.Component<RouteComponentProps<{}>> {
    constructor() {
        super();
        this.state = { currentCount: 0 };
    }

    public render() {
        return <div>
            <h1>Contact</h1>
            <hr/>
            <h4>
                <strong>Joshua Karmel</strong>
                <address>
                    <a href="mailto:jkarmel@ipipeline.com">jkarmel@ipipeline.com</a>
                </address>
            </h4>
            <hr />
            <p>
                We are not responsible for any issues with an individual resource's website.<br/>
                If there are any issues with a website's service, please contact the respectve website's support for information.
            </p>
            <hr/>
        </div>;
    }
}
