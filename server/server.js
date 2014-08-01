var hapiMedium = require('hapi-medium'),
	MongoHandler = require('hm-mongodb-handler'),
	_ = require('underscore'),
	crypto = require('crypto'),
	fs = require('fs'),
	conf = JSON.parse(fs.readFileSync('./server/conf.json').toString()),
	routes,
	server;

handler = new MongoHandler('mongodb://' + conf.baseUrl + ':' + conf.mongoPort + '/' + conf.mongoDatabase);

routes = [
	{
		basePath: '/api',
		path: '/contracts',
		dao: handler
	}
]		

server = hapiMedium(routes, {
	url: conf.baseUrl,
	port: conf.port
});

server.route({
	method:'GET',
	path: '/',
	handler: function( request, reply ) {
		fs.readFile('./index.html', function(err, data) {
			reply(data.toString());
		})
	}

})

server.route({
	method:'GET',
	path:'/export/contracts',
	handler: function( request, reply ) {
		server.inject('/api/contracts', function(res) {

			//TODO: if this ever goes to production this should *definitely* be done at the query level with Mongo instead of via underscore
			var data = [],
				OMITTED_KEYS = ['hash', 'coder','ID','TENDER_NOTICE_ID'];

			res.result.forEach(function(r) {

				var datum = {},
					mergedKeyValuePairs = r.keyValuePairs.merge,
					mergedArrays = r.arrays.merge,
					matchesOnly = true;

				//add key value pairs
				_.chain(mergedKeyValuePairs).keys(mergedKeyValuePairs).difference(OMITTED_KEYS).value().forEach (function(key) {
					if (!matchesOnly || mergedKeyValuePairs[key].match) {
						datum[key] = mergedKeyValuePairs[key].value;
					}
					else {
						datum[key] = '';
					}	
				})

				//add arrays
				datum['location'] = _.pluck(mergedArrays.locations, 'value');

				datum = convertRecordToOcds(datum);

				data.push(_.clone(datum));
				
			})

			reply(data);

		})
	}
});

server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: { path: './', listing: false, index: true }
    }
});

server.start();

console.log('Routes: ');
console.log(_.map(server.table(), function(r){return {route:r.path, method:r.method}}));
console.log('Server listening on ' + conf.baseUrl + ':' + conf.port );
console.log('...serving data from database: ' + conf.mongoDatabase );












//==============================================================================















function convertRecordToOcds(r) {
	var result = {};

	//metadata
	result.releaseDate = new Date().toISOString().slice(0,10);
	result.releaseUid = crypto.randomBytes(20).toString('hex');
	result.release = {
		releaseType: 'tender notice',
		amounts: {
			costEstimate: {
				value: r.COSTESTIMATE,
				currency: r.ESTIMATECURRENCY
			}
		},
		goodsServices: [
			{
				description: r.CONTRACTNAME || r.CONTRACTDESCRIPTION,
				uri: r.URL
			}
		],
		tenderProcess: {
			tenderUid: r.CONTRACTNUMBER,
			processUid: r.TENDERNOTICENUMBER,
			startDate: '',
			endDate: r.SUBMISSIONDEADLINE,
			documents: [
				{
					uri: r.url,
					description: 'Tender notice homepage'
				}
			]
		}

	}

	return result;
}


		// "TENDERNOTICENUMBER" : "",
		// "STATUS" : "Closed",
		// "URL" : "http://eproc.dor.gov.np/tender_details.php?tid=31418",
		// "CONTRACTDETAILS" : "DROJKR/337107-4/070-71 /151",
		// "ISSUER" : "Issued by\\u0009D. R. O. Janakpur",
		// "PUBLICATIONDATE" : "2014-04-21",
		// "PUBLISHEDIN" : "Rajdhani",
		// "DOCUMENTPURCHASEDEADLINE" : "2014-05-05",
		// "SUBMISSIONDEADLINE" : "2014-05-06",
		// "OPENINGDATE" : "2014-05-06",
		// "CONTRACTNAME" : "",
		// "CONTRACTDESCRIPTION" : "",
		// "COSTESTIMATE" : "",
		// "ESTIMATECURRENCY" : "NPR",
		// "DATASOURCE" : "",
		// "CODER_ID" : "",
		// "CONTRACTNUMBER" : "",
		// "CONTRACTTYPE" : "CONSTRUCTION",
		// "PROJECTNAME" : "Road Construction",
		// "PROJECTNUMBER" : "",
		// "PROJECTFUNDER" : "",
		// "location" : ["Central", "Central|Janakpur", "Central|Janakpur|Sarlahi", "Central|Janakpur|Sarlahi|Khirwa", "Central|Janakpur|Sarlahi|Chhatona"]

//releaseDate is ambiguous for secondary publishers
