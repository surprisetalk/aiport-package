
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

var sort_packages = package_names =>
{
    var package_buckets = {};
    for( var i in package_names )
	if( package_names[i].startsWith('aiport-') )
	{
	    var package_name_parts = package_names[i].match( /-([a-z]+)-/gi );
	    if( package_name_parts.length >= 2 )
		package_buckets[ package_name_parts[0] ] = _.rest( package_name_parts ).join('-');
	}
    return package_buckets;
};

module.exports.fetch = () => 
    npm_keywords(['aiport'])
	.then( sort_packages );

module.exports.ls = () =>
    sort_packages( 
	fs.readdirSync( path.dirname( require.main.filename ) + "/node_modules" )
	    .filter( package_name => package_name.startsWith('aiport-') ) );
