
var app = angular.module('pwapp', ['ngRoute', 'ngCookies', 'ui.bootstrap'])
                .config(config);

    config.$inject = ['$routeProvider'];
function config($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "/home.html",
            controller: "homeController"
        })
        .when("/login", {
            templateUrl: "account/login/login.html",
            controller: "loginController"
        })
        .when("/register", {
            templateUrl: "account/register/register.html",
            controller: "registerController"
        })
        .when("/transactions", {
            templateUrl: "transaction/create/transaction.create.html",
            controller: "transactionCreateController"
        })
        .otherwise({ redirectTo: "/home" });
}

app.constant('appSettings', {
    serviceUri: "http://localhost:39700/"
});

