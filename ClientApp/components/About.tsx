import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Panel } from 'react-bootstrap';

export class About extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>About GamePool</h1>
            <h4>The latest, most popular gaming news in one convenient place.</h4>
            <hr/>
            <h3> 
                The new news aggregate, <i>GamePool</i>, "pools together" the most popular gaming news outlets into one seamless stream of the latest articles.
                Using each publicly provided RSS feed from the respective news resource, the most recent articles are taken and presented.
                A four-color theme is applied to each resource, so you can easily spot out your favorite website.
                Created by Joshua Karmel, this has become a passion project of his and hopes to continue improving and working on the website.
            </h3>
            <hr />
            <h4><b>Technologies used:</b>
                <ul>
                    <li>C# / ASP.NET</li>
                    <li>React w/ Typescript</li>
                    <li>React-Bootstrap</li>
                    <li>VisualStudio 2017</li>
                    <li>RSS</li>
                    <li>Azure Websites</li>
                </ul>
            </h4>
        </div>;
    }
}
