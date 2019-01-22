import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='main-nav'>
            <div className='navbar navbar-inverse' style={{ backgroundColor: "#1d406b"}}>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse' style={{ backgroundColor: "#162c45" }}>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'} style={{ backgroundColor: "#162c45"}}>GamePool</Link>
                </div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/news'} activeClassName='active' data-toggle='collapse' data-target='.navbar-collapse'>
                                <span className='glyphicon glyphicon-globe'></span>The Pool
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/resources'} activeClassName='active' data-toggle='collapse' data-target='.navbar-collapse'>
                                <span className='glyphicon glyphicon-list-alt'></span>Sources
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/about'} exact activeClassName='active' data-toggle='collapse' data-target='.navbar-collapse'>
                                <span className='glyphicon glyphicon-question-sign'></span>About</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/contact'} activeClassName='active' data-toggle='collapse' data-target='.navbar-collapse'>
                                <span className='glyphicon glyphicon-earphone'></span> Contact
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}
