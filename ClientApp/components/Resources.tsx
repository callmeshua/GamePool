import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Panel, Button, ButtonGroup, Image, ProgressBar, Grid, Col, Row } from 'react-bootstrap';
import { ArticleData } from './interfaces/ArticleData';
import { Resource } from './interfaces/Resource';

interface FetchDataState {
    resources: Resource[];  //list of all resources of resource type
    loading: boolean;       //state of loading
}

export class Resources extends React.Component<RouteComponentProps<{}>, FetchDataState> {

    constructor() {
        super();
        this.state = { resources: [], loading: true };

        //fetches the resources from the ResourceDataController
        fetch('api/ResourceData/ResourceList').then(response => response.json() as Promise<Resource[]>).then(data => {
            this.setState({ resources: data, loading: false });
        })
        .catch((error) => {
            console.warn(error);
        });
            
    }

    public render() {
        //if still loading, render bar, else render the table
        let contents = this.state.loading
            ? <div><ProgressBar active now={100} label="Loading Resources..." style={{ width: "200px" }} /></div>
            : Resources.renderResourceCardTable(this.state.resources);

        return <div>
                    <h1>Resources</h1>
                    <h4>All the best gaming news outlets in one convenient place.</h4>
                    <hr />
                    {contents}
                    <hr />
                </div>;
    }

    //sorts the resources by name adn renders the table
    private static renderResourceCardTable(resources: Resource[]) {
        resources.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        var resourcePanels = resources.map(resource => this.getResourcePanel(resource));

        return <div>
            <Grid fluid>
                <Row className="show-grid">
                    {resourcePanels}
                </Row>
            </Grid>
        </div>;
    }

    //generates each resource's panel of information
    private static getResourcePanel(resource: Resource) {
        //list of buttons from the resource's links
        const buttonGroup = this.getButtonGroup(resource);

        //column sized so fits two in medium/large, and one in small
        //column formatted as Name of resource in header with  list of links as button group
        return <Col sm={9} md={8} lg={6} style={{ height: "150px", maxWidth: "575px" }}>
            <Panel style={{ borderColor: resource.highlight, width: "100%" }}>
                <Panel.Heading style={{ backgroundColor: resource.color1, borderColor: resource.highlight, color: resource.color2 }} >
                    <Panel.Title componentClass="h2">
                        <a href={resource.homePage} target="_blank">
                            {resource.name}
                            &nbsp;&nbsp;&nbsp;
                            <img src={resource.logo} style={{height:"25px"}}/>
                        </a>
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body style={{ backgroundColor: resource.color3 }}>
                    {buttonGroup}
                </Panel.Body>
            </Panel>
        </Col>
    }

    //generates the button group
    private static getButtonGroup(resource: Resource) {
        return <div className="btn-group">{this.getLinkButtons(resource,0)}</div>
    }

    //generates each button for the Button Group
    private static getLinkButtons(resource: Resource, linkNum: number) {
        const buttonHover = resource.color2;
        var buttonColor = { backgroundColor: resource.color1, borderColor: resource.color2, fontColor: '#000000' };
        var links = [];
        var linkName = "";
        var linkRef = "";

        //loops though each ilnk in the resource
        //CHANGE RESOURCE LINKS TO TYPE SO THIS IS CONDENSED
        for (var i = 0; i < 6; i++) {
            switch (i) {
                case 0: {
                    linkName = resource.link1Name;
                    linkRef = resource.link1Ref;
                    break;
                }
                case 1: {
                    linkName = resource.link2Name;
                    linkRef = resource.link2Ref;
                    break;
                }
                case 2: {
                    linkName = resource.link3Name;
                    linkRef = resource.link3Ref;
                    break;
                }
                case 3: {
                    linkName = resource.link4Name;
                    linkRef = resource.link4Ref;
                    break;
                }
                case 4: {
                    linkName = resource.link5Name;
                    linkRef = resource.link5Ref;
                    break;
                }
                case 5: {
                    linkName = resource.link6Name;
                    linkRef = resource.link6Ref;
                    break;
                }
            }
            if (linkName != "" && linkRef != "") {
                links.push(<Button style={{ backgroundColor: resource.color2, borderColor: resource.highlight, color: resource.color1 }} href={linkRef} target="_blank">{linkName}</Button>);
                linkNum++;
            }
            else {
                linkNum = 0;
            }
        }
        return links;
    }

}

