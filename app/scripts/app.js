require.config({

    baseUrl: 'scripts/vendor',

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
