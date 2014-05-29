define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        ShellView   = require('app/views/Shell'),
        HomeView    = require('app/views/Home'),

        $body = $('body'),
        shellView = new ShellView({el: $body}).render(),
        $content = $("#content", shellView.el),
        homeView = new HomeView({el: $content});

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "contact": "contact",
            "about": "about",
        },

        home: function () {
            console.log("On home view");
            homeView.render();
            shellView.selectMenuItem('home-menu');
        },

        contact: function () {
            require(["app/views/Contact"], function (ContactView) {
                var view = new ContactView({el: $content});
                view.render();
                shellView.selectMenuItem('contact-menu');
            });
        },

        about: function () {
            require(["app/views/About"], function (AboutView) {
                var view = new AboutView({el: $content});
                view.render();
                shellView.selectMenuItem('about-menu');
            });
        },

    });

});
