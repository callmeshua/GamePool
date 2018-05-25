using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Xml;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }

        /*
        private string ParseRssFile()
        {
            XmlDocument rssXmlDoc = new XmlDocument();

            // Load the RSS file from the RSS URL
            rssXmlDoc.Load("http://feeds.feedburner.com/techulator/articles");

            // Parse the Items in the RSS file
            XmlNodeList rssNodes = rssXmlDoc.SelectNodes("rss/channel/item");

            string rssContent = "";

            // Iterate through the items in the RSS file
            foreach (XmlNode rssNode in rssNodes)
            {
                XmlNode rssSubNode = rssNode.SelectSingleNode("title");
                string title = rssSubNode != null ? rssSubNode.InnerText : "";

                rssSubNode = rssNode.SelectSingleNode("link");
                string link = rssSubNode != null ? rssSubNode.InnerText : "";

                rssSubNode = rssNode.SelectSingleNode("description");
                string description = rssSubNode != null ? rssSubNode.InnerText : "";

                rssContent += "<a href='" + link + "'>" + title + "</a><br>" + description;
            }

            // Return the string that contain the RSS items
            return rssContent;
        }*/
    }

}
