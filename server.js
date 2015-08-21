/* Module dependencies */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var url = "http://bakersfield.craigslist.org/";
var base_url = url+"search/vac?query=view";

/**
 * Get base url from command line.
 * Format : node server.js <url>
 */
var limit = process.argv[2] || 100000;
var Data = [];

/* Request for content */
request(base_url,function(err,response,body){
	if(response && response.statusCode == 200){
		/* Load html data from body into cheerio */
		var $ = cheerio.load(body);
		/* hdrlink is the url for href of results title */
		$('.hdrlnk').each(function(i,d){
			Data.push({
				name:d.children[0].data,
				url:d.attribs.href
			});
		});
		/* Start looping through the links */
		var iterator = 0;
		var Store = [];
		function recur(){
			if(iterator == limit){
				fs.writeFileSync('final_data.json',JSON.stringify(Store));
				console.log("Done!");
			}
			else{
				request(url+Data[0].url,function(e,r,b){
					if(r && r.statusCode == 200){
						var $ = cheerio.load(b);
						var map = $('#map');
						var item = {
							title:Data[0].name,
							text:$('#postingbody').text(),
							map:map && map[0]? [map[0].attribs['data-latitude'],map[0].attribs['data-longitude']] : []
						};
						Store.push(item);
						Data.splice(0,1);
						console.log((iterator+1)+" done...");
						iterator++;
						recur();
					}
				})
			}
		}
		recur();
	}
	else console.log("Error occured",err);
});