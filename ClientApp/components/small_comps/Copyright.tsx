import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Panel } from 'react-bootstrap';

export class Copyright extends React.Component {
    public render() {
        return <span className='navbar-text copyright'>&copy; - 2018 GamePool</span>;
    }
}
