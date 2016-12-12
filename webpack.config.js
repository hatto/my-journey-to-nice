'use strict';

var project         = require('./package.json'),
    distDir         = project.dist_path,
    assetsDir       = project.resources_path,
    path            = require('path')
    ;

var env = process.env.NODE_ENV || 'dev';
var vars = { // info about the application
    version: project.version,
    name: project.name,
    env: env,
    strava: project.strava,
    instagram: project.instagram,
    googlemaps: project.googlemaps
};

module.exports = {
    entry: path.resolve(__dirname, assetsDir, './js/App.js'),
    output: {
        path: path.resolve(__dirname, distDir, './js'),
        filename: 'app.min.js'
    },
    module: {
        loaders: [
            {
      				test: /\.jsx?$/,
      				exclude: /(node_modules|bower_components)/,
      				loaders: ['babel'],
      			}
        ]
    },
    externals: {
        vars: JSON.stringify(vars)
    }
};
