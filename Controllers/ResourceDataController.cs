using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Xml;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    public class ResourceDataController : Controller
    {
        //TEST FUNCTION
        [HttpGet ("[action]/{s}")]
        public string ayyLmao(string s)
        {
            /*string[] sa = new string[10];
            foreach(x in sa)
            {

            }*/
            return s.Replace('^', '/');
        }

        //Parses single rss link into list of articles from News.tsx fetch
        [HttpGet ("[action]/{rssLink}")]
        public string[][] ParseRssFileList(string rssLink)
        {
            //DECRYYPTION
            rssLink = rssLink.Replace("^^", "/");
            rssLink = rssLink.Replace("<>", "?");

            XmlDocument rssXmlDoc = new XmlDocument();

            //namespace for media and dc
            XmlNamespaceManager ns = new XmlNamespaceManager(rssXmlDoc.NameTable);
            ns.AddNamespace("media", "http://search.yahoo.com/mrss/");
            ns.AddNamespace("dc", "http://purl.org/dc/elements/1.1/");
            ns.AddNamespace("content", "http://purl.org/rss/1.0/modules/content/");

            //new list of articles to be returned
            string[][] articleList = new string[20][];

            // Load the RSS file from the RSS URL
            try
            {
                rssXmlDoc.Load(rssLink);
            }
            catch
            {
                //Populates the article list as empty and with error handling text if there is an error
                for(int i = 0; i < articleList.Length; i++)
                {
                    articleList[i] = new string[] { "ERR INVALID RSS LINK", "err001", "", "", "", "", "" };
                }
                return articleList;
            }

            // Parse the Items in the RSS file
            XmlNodeList rssNodes = rssXmlDoc.SelectNodes("rss/channel/item");
            if (rssNodes.Count == 0)
            {
                //Populates the article list as empty and with error handling text if there is an error
                for (int i = 0; i < articleList.Length; i++)
                {
                    articleList[i] = new string[] { "Atom Format, Cannot Read", "err002", "", "", "", "", "" };
                }
                return articleList;
            }
            else
            {

                //loops through the article list to populate
                for (int index = 0; index < articleList.Length;
                    index++)
                {
                    XmlNode rssNode = rssNodes[index];

                    //extra precautions for checking if the node is null
                    if (rssNode != null)
                    {
                        //title of article
                        XmlNode rssSubNode = rssNode.SelectSingleNode("title");
                        string title = rssSubNode != null ? rssSubNode.InnerText : "";

                        //link to the article
                        rssSubNode = rssNode.SelectSingleNode("link");
                        string link = rssSubNode != null ? rssSubNode.InnerText : "";

                        //description of article (might contain images)
                        rssSubNode = rssNode.SelectSingleNode("description");
                        string description = rssSubNode != null ? rssSubNode.InnerText : "";

                        //cover image of article (if in "media:content")
                        rssSubNode = rssNode.SelectSingleNode("media:content", ns);
                        string image = rssSubNode != null ? rssSubNode.Attributes["url"].Value : "";

                        //if rss has no "media:content" subnode, checks the description for the first image
                        if (rssNode.SelectSingleNode("media:thumbnail", ns) != null)
                        {
                            rssSubNode = rssNode.SelectSingleNode("media:thumbnail", ns);
                            image = rssSubNode != null ? rssSubNode.Attributes["url"].Value : "";
                        }
                        else if(rssNode.SelectSingleNode("thumbnail_url") != null)
                        {
                            rssSubNode = rssNode.SelectSingleNode("thumbnail_url");
                            image = rssSubNode != null ? rssSubNode.InnerText : "";
                        }
                        else if ((description.Contains("src=") || description.Contains("<img")) && image == "" && rssSubNode == null)
                        {
                            int imageLoc = description.IndexOf("src=") + 5;
                            int imageLength = description.IndexOf(" ", description.IndexOf("src=")) - imageLoc - 1;
                            string imageLink = description.Substring(imageLoc, imageLength);

                            //makes sure the link is an image file (could be youtube link or any other src)
                            if (imageLink.ToUpper().Contains(".PNG") || imageLink.ToUpper().Contains(".JPG") || imageLink.ToUpper().Contains(".JPEG") || imageLink.ToUpper().Contains(".GIF"))
                            {
                                image = imageLink;
                            }
                        }
                        //checks for just a node called image
                        else if (rssNode.SelectSingleNode("content:encoded", ns) != null)
                        {
                            rssSubNode = rssNode.SelectSingleNode("content:encoded", ns);
                            string content = rssSubNode != null ? rssSubNode.InnerText : "";
                            if (content.Contains("src=") && image == "" && rssSubNode != null)
                            {
                                int imageLoc = content.IndexOf("src=") + 5;
                                int imageLength = content.IndexOf(" ", content.IndexOf("src=")) - imageLoc - 1;
                                string imageLink = content.Substring(imageLoc, imageLength);

                                //makes sure the link is an image file (could be youtube link or any other src)
                                if (imageLink.ToUpper().Contains(".PNG") || imageLink.ToUpper().Contains(".JPG") || imageLink.ToUpper().Contains(".JPEG") || imageLink.ToUpper().Contains(".GIF"))
                                {
                                    image = imageLink;
                                }
                            }
                        }//checks for the enclosure tag
                        else if (rssNode.SelectSingleNode("enclosure") != null && image != "")
                        {
                            rssSubNode = rssXmlDoc.SelectSingleNode("enclosure");
                            image = rssSubNode != null ? rssSubNode.Attributes["url"].Value : "";
                        }

                        //date of article (checks for formats of "date", "pubDate", "dc:date")
                        rssSubNode = rssNode.SelectSingleNode("date");
                        if (rssSubNode == null && rssNode.SelectSingleNode("pubDate") != null)
                        {
                            rssSubNode = rssNode.SelectSingleNode("pubDate");
                        }
                        else if (rssSubNode == null && rssNode.SelectSingleNode("dc:date", ns) != null)
                        {
                            rssSubNode = rssNode.SelectSingleNode("dc:date", ns);
                        }
                        string date = rssSubNode != null ? DateTime.Parse(rssSubNode.InnerText.ToString()).ToString() : "";

                        //gets author of article
                        rssSubNode = rssNode.SelectSingleNode("dc:creator", ns);
                        string author = rssSubNode != null ? rssSubNode.InnerText : "";
                        if (author == "" && rssNode.SelectSingleNode("author") != null)
                        {
                            rssSubNode = rssNode.SelectSingleNode("author");
                            author = rssSubNode != null ? rssSubNode.InnerText : "";
                        }

                        articleList[index] = new string[] { title, link, description, date, image, author };
                    }
                }
            }

            return articleList;

        }

        //Returns the list resources
        [HttpGet("[action]")]
        public IEnumerable<ResourceData> ResourceList()
        {
            return Enumerable.Range(0, ResourceNames.Length).Select(index => new ResourceData
            {
                Name = ResourceNames[index],
                HomePage = ResourceHomes[index],
                Color1 = ResourceColorSchemes[index, 0],
                Color2 = ResourceColorSchemes[index, 1],
                Color3 = ResourceColorSchemes[index, 2],
                Highlight = ResourceColorSchemes[index, 3],
                RSSLink = ResourceRSSLinks[index],
                Link1Name = ResourceLinks[index, 0, 0],
                link1Ref = ResourceLinks[index, 0, 1],
                link2Name = ResourceLinks[index, 1, 0],
                link2Ref = ResourceLinks[index, 1, 1],
                link3Name = ResourceLinks[index, 2, 0],
                link3Ref = ResourceLinks[index, 2, 1],
                link4Name = ResourceLinks[index, 3, 0],
                link4Ref = ResourceLinks[index, 3, 1],
                link5Name = ResourceLinks[index, 4, 0],
                link5Ref = ResourceLinks[index, 4, 1],
                link6Name = ResourceLinks[index, 5, 0],
                link6Ref = ResourceLinks[index, 5, 1],
                Logo = LogoLinks[index]
            });
        }

        //unused
        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }


    /*
        * **********
        * DATA TYPES
        * ***********
    */
        public class ArticleData
        {
            public string Name { get; set; }
            public string Link { get; set; }
            public string Desc { get; set; }
            public string Date { get; set; }
            public string Author { get; set; }
        }

        public class ResourceData
        {
            public string Name { get; set; }
            public string HomePage { get; set; }
            public string Color1 { get; set; }
            public string Color2 { get; set; }
            public string Color3 { get; set; }
            public string Highlight { get; set; }
            public string RSSLink { get; set; }

            //Change these to a list of Link type with names and refs
            public string Link1Name { get; set; }
            public string link1Ref { get; set; }
            public string link2Name { get; set; }
            public string link2Ref { get; set; }
            public string link3Name { get; set; }
            public string link3Ref { get; set; }
            public string link4Name { get; set; }
            public string link4Ref { get; set; }
            public string link5Name { get; set; }
            public string link5Ref { get; set; }
            public string link6Name { get; set; }
            public string link6Ref { get; set; }
            public string Logo { get; set; }
        }

        //list of resources by name
        private static string[] ResourceNames = new[]
        {
            "Destructoid",
            "Game Informer",
            "GamesRadar+",
            "Gamespot",
            "GiantBomb",
            "IGN",
            "Nintendo Life",
            "PC Gamer",
            "Playstation.Blog",
            "Polygon",
            "VG24/7",
            "Xbox Wire"
        };

        //homePage
        private static string[] ResourceHomes = new[]
        {
            "http://www.destructoid.com",
            "http://www.gameinformer.com",
            "http://www.gamesradar.com",
            "http://www.gamespot.com",
            "http://www.giantbomb.com",
            "http://www.ign.com",
            "http://www.nintendolife.com/",
            "http://www.pcgamer.com",
            "https://blog.us.playstation.com",
            "http://www.polygon.com",
            "http://www.vg247.com",
            "http://news.xbox.com/en-us"
        };

        //{color1, color2, color3, highlight}
        private static string[,] ResourceColorSchemes =
        {
            {"#222", "#a6d05b", "#c00", "#222"},//destructoid
            { "rgb(56, 138, 194)", "#ccc", "#333", "#333"},//GI
            {"#F26722", "#fff", "#333","#F26722"},//gamesradar
            {"#262626", "#fd0", "#fff", "#e03800" },//gamespot
            {"#414549", "#000", "#861313", "#414549" },//GB
            {"#000", "#bf1313", "#fff", "#000" },//ign
            {"#fff", "#e60012", "#292929", "#e60012" },//nintendo life
            {"#DC191B", "#fff", "#0F1618",  "#DC191B" },//PCG
            {"rgb(0, 94, 158)", "#fff", "#7a7976", "#1273b7" },//PS.Blog
            {"rgb(204, 0, 65)", "#B4D5FF", "#fff", "#32283c" },//polygon
            {"#c6262d", "#fff", "#fff", "#000" },//vg247
            {"#379f17", "#fff",  "#505050","#000" },//Xbox
        };

        //each resource's list of link names
        private static string[,,] ResourceLinks =
        {
            //destructoid
            {
                {"Reviews", "https://www.destructoid.com/products-index.phtml?filt=reviews&date_s=desc&category="}, 
                {"Popular", "https://www.destructoid.com/popular-posts.phtml"}, 
                {"Videos","https://www.destructoid.com/?t=video" }, 
                {"YouTube","https://www.youtube.com/dtoid" },
                {"Twitter","https://twitter.com/destructoid" },
                {"","" }
            },
            //gi
            {
                {"News", "https://www.gameinformer.com/news.aspx" },
                {"Previews", "https://www.gameinformer.com/previews.aspx" },
                {"Reviews","https://www.gameinformer.com/reviews.aspx" },
                {"The Lab","https://www.gameinformer.com/p/thelab.aspx" },
                {"YouTube","https://www.youtube.com/user/gameinformer" },
                {"Twitter","https://twitter.com/GameInformer" }
            },
            //gamesradar
            {
                {"News", "https://www.gamesradar.com/news/games/" },
                {"Reviews","https://www.gamesradar.com/all-platforms/reviews/" },
                {"Features", "https://www.gamesradar.com/features/" },
                {"Hot This Week","https://www.gamesradar.com/8-things-to-watch-out-for-this-week-march-30/" },
                {"YouTube","https://www.youtube.com/user/gamesradar" },
                {"Twitter","https://twitter.com/gamesradar" }
            },
            //gamespot
            {
                {"News", "https://www.gamespot.com/news/" },
                {"Reviews", "https://www.gamespot.com/reviews/" },
                {"Videos", "https://www.gamespot.com/videos/" },
                {"Gametech", "https://www.gamespot.com/gametech/" },
                {"YouTube", "https://www.youtube.com/user/gamespot" },
                {"Twitter", "https://twitter.com/gamespot" }
            },
            //GiantBomb
            {
                {"News", "https://www.giantbomb.com/news/" },
                {"Reviews", "https://www.giantbomb.com/reviews/" },
                {"Videos", "https://www.giantbomb.com/videos/" },
                {"Podcasts", "https://www.giantbomb.com/podcasts/" },
                {"YouTube", "http://youtube.com/giantbomb" },
                {"Twitter", "http://twitter.com/giantbomb" }
            },
            //IGN
            {
                {"News", "http://www.ign.com/news/" },
                {"Videos", "http://www.ign.com/videos" },
                {"Reviews", "http://www.ign.com/reviews" },
                {"Esports", "http://www.ign.com/events/esports" },
                {"YouTube", "http://www.youtube.com/ign" },
                {"Twitter", "https://twitter.com/IGN" }
            },
            //Nintendo Life
            {
                {"News", "http://www.nintendolife.com/news" },
                {"Videos", "http://www.nintendolife.com/videos" },
                {"Reviews", "http://www.nintendolife.com/reviews" },
                {"Features", "http://www.nintendolife.com/features" },
                {"YouTube", "https://www.youtube.com/nintendolife" },
                {"Twitter", "https://twitter.com/nintendolife" }
            },
            //PC Gamer
            {
                {"News", "http://www.pcgamer.com/news" },
                {"Reviews", "http://www.pcgamer.com/reviews/" },
                {"Hardware", "http://www.pcgamer.com/hardware/"},
                {"Best Of", "http://www.pcgamer.com/best-of" },
                {"YouTube", "https://www.youtube.com/pcgamer" },
                {"Twitter", "https://twitter.com/pcgamer" }
            },
            //Playstation.blog
            {
                {"PS4", "http://www.pcgamer.com/news" },
                {"PS3", "http://www.pcgamer.com/reviews/" },
                {"PS Vita", "http://www.pcgamer.com/hardware/"},
                {"PSN", "http://www.pcgamer.com/best-of" },
                {"YouTube", "https://www.youtube.com/PlayStation" },
                {"Twitter", "http://twitter.com/Playstation" }
            },
            //Polygon
            {
                {"News", "https://www.polygon.com/news" },
                {"Reviews", "https://www.polygon.com/reviews" },
                {"Features", "https://www.polygon.com/features"},
                {"Videos", "https://www.polygon.com/videos" },
                {"YouTube", "https://www.youtube.com/user/polygon" },
                {"Twitter", "https://twitter.com/Polygon" }
            },
            //vg247
            {
                {"PS4", "https://www.vg247.com/category/uncategorized/sony/ps4/" },
                {"Xbox", "https://www.vg247.com/category/uncategorized/microsoft/" },
                {"Nintendo", "https://www.vg247.com/category/uncategorized/nintendo/"},
                {"PC", "https://www.vg247.com/category/pc/" },
                {"YouTube", "http://youtube.com/MrVG247" },
                {"Twitter", "http://twitter.com/vg247" }
            },
            //Xbox Wire
            {
                {"Consoles", "https://news.xbox.com/en-us/consoles/" },
                {"Games", "https://news.xbox.com/en-us/games/" },
                {"Entertainment", "http://www.pcgamer.com/hardware/"},
                {"Insider", "https://news.xbox.com/en-us/insider/" },
                {"YouTube", "https://www.youtube.com/xbox" },
                {"Twitter", "https://twitter.com/xbox" }
            }
        };

        //rss links for each resource
        private static string[] ResourceRSSLinks = new string[]
        {
            
            "http://feeds.feedburner.com/Destructoid",//destructoid
            "https://www.gameinformer.com/b/MainFeed.aspx?Tags=news",//gi
            "https://www.gamesradar.com/all-platforms/news/rss/",//gamesradar
            "https://www.gamespot.com/feeds/mashup",//gamespot
            "https://www.giantbomb.com/feeds/mashup",//gb
            "http://feeds.ign.com/ign/games-all",//ign
            "http://www.nintendolife.com/feeds/latest",//nintendo life
            "https://www.pcgamer.com/rss/",//pc gamer
            "http://feeds.feedburner.com/psblog",//playstation.blog
            "https://www.polygon.com/rss/index.xml",//polygon
            "https://www.vg247.com/feed/",//vg247
            "https://news.xbox.com/en-us/feed/stories/"//xbox
        };

        private static string[] LogoLinks = new string[]
        {
            "https://www.destructoid.com/sites/_default/img/top-nav/destructoid-logo.png",//dtoid
            "https://pbs.twimg.com/profile_images/798310412508770304/EVgG-Ldt.jpg",//gi
            "https://static-cdn.jtvnw.net/jtv_user_pictures/gamesradar-profile_image-a0672b8671d3dac3-300x300.png",//gr
            "http://icons.iconarchive.com/icons/custom-icon-design/pretty-social-media-2/256/Gamespot-icon.png",//gs
            "http://i.imgur.com/oVjj4Iu.png",//gb
            "https://i.imgur.com/dPx8RI0.png",//ign
            "https://i.imgur.com/Tcx3S2s.png",//NL
            "https://yt3.ggpht.com/a-/AJLlDp0eTVg4WcJmpy0YvW4MIoQ2FZ1ZvOmXwfkgbw=s900-mo-c-c0xffffffff-rj-k-no",//pcg
            "https://farm4.staticflickr.com/3937/15725947641_8ac87c1275_o.jpg",//psb
            "https://i.imgur.com/R2yOOQt.png",//poly
            "https://assets.vg247.com/current//2016/02/VG247-SQ_Red-on-White.jpg",//vg247
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/2000px-Xbox_one_logo.svg.png"//xbox
        };
    }

}
