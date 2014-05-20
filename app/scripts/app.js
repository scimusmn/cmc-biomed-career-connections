/**
 * Use this file to include your JS libraries and files using require.js
 * http://requirejs.org/
 */
require.config({

    baseUrl: 'scripts/vendor',

    /**
     *
     * For development
     * Require will cause your scripts to be cached, which can be a pain
     * during development. This tacks a dynamic date on the end of each
     * js include.
     *
     * Remove for production.
     */
    urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        app: '../app',
        tpl: '../tpl',
        'jquery': 'jquery/dist/jquery',
        'modernizer': 'modernizer/modernizer',
        'underscore': 'underscore/underscore',
        'backbone': 'backbone/backbone',
        'text': 'text/text'
    },

    /**
     * Backbone and Underscore are not AMD compliant. We have to use these
     * shims to load them.
     */
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "underscore": {
            deps: [],
            exports: "_"
        },
    }

});

require(['jquery', 'backbone', 'app/router'], function ($, Backbone, Router) {
    var router = new Router();
    Backbone.history.start();
});
