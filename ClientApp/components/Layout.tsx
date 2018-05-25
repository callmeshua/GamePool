import * as React from 'react';
import { NavMenu } from './small_comps/NavMenu';
import { Panel } from 'react-bootstrap';
import { Copyright } from './small_comps/Copyright';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div className='main-div container-fluid' style={{ fontWeight: "bold", fontFamily: "Times New Roman" }} >
            <div>
                <div>
                    <NavMenu />
                </div>
                <div className='Row' style={{width: "100%"}}>
                    {this.props.children}
                    <Copyright />
                </div>
            </div>
        </div>;
    }
}
