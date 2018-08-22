import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Panel, Button, ButtonGroup, Image, ProgressBar, Grid, Col, Row, DropdownButton, MenuItem, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Resources } from './Resources';
import { Resource } from './interfaces/Resource';
import { ArticleData } from './interfaces/ArticleData';
import * as RSS from 'rss';
import { Menu } from 'react-bootstrap/lib/Dropdown';

interface FetchDataState {
    resources: Resource[];          //list of resources of Resource type
    articles: ArticleData[];        //list of all articles of ArticleData type
    loading: boolean;               //state of loading
    loadPer: number;                //percentage of loaded
    loadContent: string;            //what is being loaded
    articlePanels: JSX.Element[];   //list of panels of articles
    sortBy: string;                 //the current sorting of articles style
    filters: Filter[];              //list of all filters type
    timer: number;
}

//type filter with name and if it is currently active
interface Filter {
    name: string;
    active: boolean;
}

export class News extends React.Component<RouteComponentProps<{}>, FetchDataState> {

    constructor() {
        super();
        this.state = {
            resources: [],
            loading: true,
            loadPer: 0,
            articles: [],
            loadContent: "News",
            articlePanels: [],
            sortBy: "date-descending",
            filters: [],
            timer: Date.now()
        };

        this.fetchRSS = this.fetchRSS.bind(this);
        this.renderAllArticles = this.renderAllArticles.bind(this);
        this.getNewsPanel = this.getNewsPanel.bind(this);

        //fetches all resources
        fetch('api/ResourceData/ResourceList')
            .then(response => response.json() as Promise<Resource[]>)
            .then(data => {
                this.setState({ resources: data, loadPer: 0 });
                var i: number = 1;

                //after all resources are retrieved, fetches the articles from rss
                this.state.resources.map((resource: Resource, index: number) => {
                    this.fetchRSS(resource, 0, index);
                    this.state.filters.push({ name: resource.name, active: true });
                    this.setState({ loadPer: ((index / this.state.resources.length) * 100) });
                    i = index;
                })

                //updates to the progress bar
                this.setState({ loadPer: ((i / this.state.resources.length) * 100) });
                if (this.state.articles.length > 0) {
                    this.setState({ loading: false });
                }
            });
    }

    public render() {
        //if still loading, show progress bar, else, render all the articles
        var contents = this.state.loading && this.state.articles.length <= 0 ?
            <ProgressBar active now={this.state.loadPer} label={"Loading " + this.state.loadContent + "..."} style={{ width: "300px" }} /> :
            this.renderAllArticles();

        return <div>
            <meta http-equiv="refresh" content="5" />
            <h1>The Pool</h1>
            <h4>The latest, most popular gaming news in one convenient place.
                <br /><br />
                Below are the 20 most recently published articles from each of your favorite video game news outlets.
                <br /><br />
                Each resource is associated with a color scheme so you can easily spot out your favorite website's articles.
                <br /><br />
                To see our list of resources, check out the Resources tab in the menu.
            </h4>
            <hr />
            <div>
                {this.renderSortDropdown()}
                &nbsp;&nbsp;&nbsp;
                {this.renderFilterDropdown()}
            </div>
            <hr />
            {contents}
            <hr/>
        </div>;
    }

    //renders the dropdown for the filters 
    renderFilterDropdown() {
        //calls the render filters 
        var filterItems = this.renderFilters();

        return <DropdownButton style={{ backgroundColor: "#1d406b", color: "white", borderColor: "#0e1c2c", zIndex: 0 }} title="Filter" id={`dropdown-basic-{i}`}>
                    <MenuItem eventKey="all" onSelect={(evt: any) => this.handleFilter(evt)}>
                        <span className="menu-item">All</span>
                    </MenuItem>
                    <MenuItem eventKey="none" onSelect={(evt: any) => this.handleFilter(evt)}>
                        <span className="menu-item">None</span>
                    </MenuItem>
                    <MenuItem divider />
                    {filterItems}
                </DropdownButton>
    }

    //renders the sort dropdown with resource, date-ascending, and date-descending buttons
    renderSortDropdown() {
        var resourceCheck: JSX.Element   = this.state.sortBy == "resource"        ? < span className='glyphicon glyphicon-check' ></span> : < span className='glyphicon glyphicon-unchecked' ></span>;
        var ascendingCheck: JSX.Element  = this.state.sortBy == "date-ascending"  ? < span className='glyphicon glyphicon-check' ></span> : < span className='glyphicon glyphicon-unchecked' ></span>;
        var descendingCheck: JSX.Element = this.state.sortBy == "date-descending" ? < span className='glyphicon glyphicon-check' ></span> : < span className='glyphicon glyphicon-unchecked' ></span>;

        return <DropdownButton onSelect={(evt: any) => { this.setState({ sortBy: evt }) }}
                                style={{ backgroundColor: "#1d406b", color: "white", borderColor: "#0e1c2c" }}
                                title="Sort" id={`dropdown-basic-{i}`}>
                    <MenuItem eventKey="resource" >
                        {resourceCheck}&nbsp;&nbsp;<span className="menu-item">Resource</span>
                    </MenuItem>
                    <MenuItem eventKey="date-ascending">
                        {ascendingCheck}&nbsp;&nbsp;<span className="menu-item">Date - Ascending</span>
                    </MenuItem>
                    <MenuItem eventKey="date-descending">
                        {descendingCheck}&nbsp;&nbsp;<span className="menu-item">Date - Descending</span>
                    </MenuItem>
                </DropdownButton>
    }

    //gets the filters into menuItems
    renderFilters(){
        return this.state.filters.map((filter) => {
            var isActive = filter.active ? "active" : "";
            var check: JSX.Element = filter.active ? < span className='glyphicon glyphicon-check' ></span> : < span className='glyphicon glyphicon-unchecked' ></span>;
            return <MenuItem onSelect={(evt: any) => this.handleFilter(evt)} eventKey={filter.name} {...isActive}>
                <span className="menu-item">
                    {check}&nbsp;&nbsp;{filter.name}
                </span>
            </ MenuItem>
            });
    }

    //handles the filter buttons
    handleFilter(evt: string) {
        if (evt == "all") {
            this.state.filters.map((filter, i) => {
                this.state.filters[i].active = true;
                this.setState({});
            });
        }
        else if (evt == "none") {
            this.state.filters.map((filter, i) => {
                this.state.filters[i].active = false;
                this.setState({});
            });
        }
        else {
            this.state.filters.map((filter, i) => {
                if (filter.name == evt) {
                    this.state.filters[i].active = !filter.active;
                    this.setState({});
                }
            });
        }
    }

    //renders all articles into panels
    renderAllArticles() {
        var panelCols: JSX.Element[] = [];
        var articleList = [];

        if (this.state.sortBy == "resource") {
            articleList = this.state.articles.sort((a, b) => {
                if (a.resource.name < b.resource.name) return -1;
                if (a.resource.name > b.resource.name) return 1;
                return 0;
            });
        }
        else if (this.state.sortBy.indexOf("date") >= 0) {
            articleList = this.state.articles.sort((a, b) => {
                var sorted = new Date(a.date).getTime() - new Date(b.date).getTime()
                return sorted;
            });
            if (this.state.sortBy.indexOf("descending") >= 0){
                articleList.reverse();
            }
        }

        this.state.articles.map((article: ArticleData) => {
                this.state.filters.map(filter => {
                    if (filter.name == article.resource.name && filter.active &&
                        (article.link != "err001" && article.link != "err002")) {
                            panelCols.push(this.getNewsPanel(article));
                    }
                });
        });

        var content = panelCols.length > 0 ? <div>{panelCols}</div> : <div><h2>No news stories available</h2></div>

        return (
            <div>
                <Grid fluid>
                    <Row className="show-grid">
                        {content}
                    </Row>
                </Grid>
                <hr/>
            </div >
        );
    }

    //creates panel using data from specific article and article's resource
    getNewsPanel(article: ArticleData) {
        var credentials = this.getCredentials(article);//gets credential data
        var bodyContent = this.getBodyContent(article);//gets data for what to go in the body of the panel
        var tooltip = (
            <Tooltip id="tooltip">
                <strong>{article.name}</strong>
            </Tooltip>
        )

        article.name += " ";
        var shortTitle = article.name.substr(0, article.name.indexOf(" ", 50));

        var title = article.name.length >= 60 ?
            <div>{shortTitle}
                <span style={{ fontSize: "60%" }}>{"{...}"}</span>
            </div> :
            <span>{article.name}</span>;

        return <Col sm={6} md={6} lg={3} style={{ height: "400px" }}>
                <Panel style={{ borderColor: article.resource.highlight, width: "100%", height: "fit-content", maxHeight:"400px" }}>
                <Panel.Heading style={{ maxHeight: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal", backgroundColor: article.resource.color1, borderColor: article.resource.highlight, color: article.resource.color2 }} >
                    <Panel.Title componentClass="h2" style={{ maxHeight: "6.0em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>
                        <OverlayTrigger placement="top" overlay={tooltip}>
                            < a href={article.link} className="block-with-text" target="_blank" style={{ maxHeight: "3.6em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal", fontSize: "25px" }}>
                            {title}
                            </a>
                        </OverlayTrigger>
                        <br />
                    </Panel.Title>
                    <span style={{ color: article.resource.color2, marginBottom: "0px", fontSize: "75%", paddingTop: "15px" }}>
                        {credentials}
                    </span>
                </Panel.Heading>
                <Panel.Body style={{ color: article.resource.color1, backgroundColor: article.resource.color3, height: "fit-content" }} href={article.link}>
                    <Button style={{ maxHeight: "200px", height: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal", width: "100%", backgroundColor: article.resource.color2, borderColor: article.resource.highlight, color: article.resource.color1 }}
                        href={article.link} target="_blank">
                        {bodyContent}
                    </Button>
                </Panel.Body>
            </Panel>
        </Col>
    }

    /*
     * Helper functions
    */ 
    //determines the content for the credentials data based on if there is a date, author, or neither listed
    getCredentials(article: ArticleData) {
        var credentials;
        if (article.author != "") {
            credentials =
                <div style={{ paddingTop: "10px" }}>
                    {article.date} - by {article.author}&nbsp;&nbsp;
                    <a href={article.resource.homePage} target="_blank" style={{ color: article.resource.color2 }}>
                    ({article.resource.name})
                    &nbsp;&nbsp;
                    <Image src={article.resource.logo} style={{ height: "15px" }} />
                </a>
                </div>;
        }
        else if (article.date != "") {
            credentials =
                <div style={{ paddingTop: "10px" }}>
                    {article.date} &nbsp;&nbsp;
                    <a href={article.resource.homePage} target="_blank" style={{ color: article.resource.color2 }}>
                    ({article.resource.name})
                    &nbsp;&nbsp;
                    <Image src={article.resource.logo} style={{ height: "15px" }} />
                </a>
                </div>;
        }
        else {
            credentials =
                <div style={{ paddingTop: "10px" }}>
                <a href={article.resource.homePage} target="_blank" style={{ color: article.resource.color2 }}>
                    ({article.resource.name})
                    &nbsp;&nbsp;
                <Image src={article.resource.logo} style={{ height: "15px" }} />
                </a>
            </div>
        }
        return credentials;
    }

    //determines the body of an article panel depending on if there is an image or not to render
    getBodyContent(article: ArticleData) {
        var bodyContent;

        if (article.image == "") {
            var GIDescription = "";
            if (article.resource.name == "Game Informer") {
                var paragraphLength = article.desc.indexOf("</p>") - article.desc.indexOf("<p>") + 4;
                GIDescription = article.desc.substring(paragraphLength, article.desc.indexOf("<p>"));
                console.warn(GIDescription + " " + paragraphLength + " " + article.desc.indexOf("<p>"));
            }
            var description = article.desc.indexOf("<p>") >= 0 ? <div dangerouslySetInnerHTML={{ __html: GIDescription }} /> : <div>{article.desc}</div>;
            bodyContent =
                <div style={{ color: article.resource.color1, maxHeight: "7.2em", verticalAlign: "middle" }} className="block-with-text" href={article.link} target="_blank" >
                <Image src={article.resource.logo} style={{ height: "100%", objectFit: "cover", opacity: .25, zIndex: 1, position: "absolute", marginLeft: "-30%", webkitFilter: "drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)", filter: "drop-shadow(1px 1px 0 black), drop-shadow(-1px -1px 0 black)" }} />
                    <div style={{ position: "absolute", zIndex: 1,  }} >
                        {description}
                    </div>
                </div>
        }
        else {
            bodyContent =
                <Image src={article.image} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
        }
        return bodyContent;
    }

    //fetches data from individual resource using specific link from resource
    fetchRSS(resource: Resource, rssFeed: number, resourceNum: number) {
        //used for encrypting the links so the api link doesn't get screwy
        var re = new RegExp("/", "g");
        let extension: string = resource.rssLink.replace(re, "^^");
        re = new RegExp("\\?", "g");
        extension = extension.replace(re, "<>");

        //RSS link being used
        let link: string = "api/ResourceData/ParseRssFileList/" + extension;

        fetch(link, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((response) =>
            response.json() as Promise<string[][]>
        )
        .then((data) => {
            //populates the list of articles in the state with data retrieved
            for (var i = 0; i < data.length; i++) {
                //let d: JSX.Element = <div>{data[i][2]}</div>;
                this.state.articles.push(  {
                    name: data[i][0],
                    link: data[i][1],
                    desc: data[i][2],
                    date: data[i][3],
                    image: data[i][4],
                    author: data[i][5],
                    resource: resource //resource used for the rss link is assigned to the article
                });
            }
            if (resourceNum >= this.state.resources.length) {
                this.setState({ loading: false });
            }
            this.setState({ loadPer: ((i / this.state.articles.length) * 100) });
            return this.state.articles;
        })
        .catch((error) => {
            console.warn(error);
        });
    }

    //test fetch function
    fetchRSSArticles() {
        let linkList: string[][];
        var re = new RegExp("/", "g");
        let extension: string = this.state.resources[4].rssLink.replace(re, "^^");
        re = new RegExp("\\?", "g");
        extension = extension.replace(re, "<>");
        let link: string = "api/ResourceData/ayyLmao/" + extension;

        fetch(link, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((response) =>
            response.json() as Promise<string>
        )
        .then((data) => {
            this.setState({ loadContent: data });
        })
        .catch((error) => {
            console.warn(error);
        });
    }
}

