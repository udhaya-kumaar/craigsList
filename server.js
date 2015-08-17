/* Module dependencies */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

/**
 * Get base url from command line.
 * Format : node server.js <url>
 */
var base_url = process.argv[2];
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
		/* Write to file */
		fs.writeFileSync('final_data.json',JSON.stringify(Data));
	}
	else console.log("Error occured",err);
});