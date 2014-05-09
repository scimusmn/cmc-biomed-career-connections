require.config({
    //baseUrl: 'vendor/bower/jquery/dist',

    enforceDefine: true,
    paths: {
        'jquery': 'vendor/jquery/dist/jquery',
        'modernizer': 'vendor/modernizer/modernizer',
        'underscore': 'vendor/underscore/underscore',
        'backbone': 'vendor/backbone/backbone'
    },
    shim: {
        "underscore": {
            deps: [],
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
    }
});

require(['views/app'], function(AppView) {
    new AppView;
});

define(["jquery", "underscore", "backbone"],
    function ($, _, Backbone) {
        console.log("Test output");
        console.log("$: " + typeof $);
        console.log("_: " + typeof _);
        console.log("Backbone: " + typeof Backbone);
    }
);
