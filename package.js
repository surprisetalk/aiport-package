
var fs = require('fs');
var npm = require('npm');
var path = require('path');
var _ = require('underscore');
var npm_keywords = require('npm-keywords');

// TODO: move the core of these functions to a repo that others can use?

module.exports.install = ( aiport_package_type, aiport_package_name ) =>
    new Promise( ( res, rej ) =>
	npm.load( err => 
	{
	    if( err )
	    {
		rej( err );

	    } else {

		// TODO: check if exists?

		npm.commands.install( 
		    [ "aiport-" + aiport_package_type + "-" + aiport_package_name ], 
		    ( err, data ) => err ? rej( err ) : res( data ) 
		);

		npm.on('log', message => console.log( message ) );
	    }
	})
    );

// TODO: make template function for install and uninstall?
module.exports.uninstall = ( aiport_package_type, aiport_package_name ) =>
    new Promise( ( res, rej ) =>
	npm.load( err => 
	{
	    if( err )
	    {
		rej( err );

	    } else {

		// TODO: check if exists?

		npm.commands.uninstall( 
		    [ "aiport-" + aiport_package_type + "-" + aiport_package_name ], 
		    ( err, data ) => err ? rej( err ) : res( data ) 
		);

		npm.on('log', message => console.log( message ) );
	    }
	})
    );

// TODO: module.exports.update

var sort_packages = package_names =>
{
    var package_buckets = { pile: [], annex: [], scrap: [] };
    for( var i in package_names )
	if( package_names[i].startsWith('aiport-') )
	{
	    var package_name_parts = package_names[i].split('-');
	    if( package_name_parts.length >= 3 )
		package_buckets[ package_name_parts[1] ].push( _.rest( package_name_parts, 2 ).join('-') );
	}
    return package_buckets;
};

module.exports.available = () => 
    npm_keywords(['aiport'])
	.then( packages => _.pluck( packages, 'name' ) )
	.then( sort_packages );

module.exports.installed = () =>
    sort_packages( 
	fs.readdirSync( path.dirname( require.main.filename ) + "/node_modules" )
	    .filter( package_name => package_name.startsWith('aiport-') ) );
