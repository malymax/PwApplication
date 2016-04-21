
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

app.filter('filterTransaction', function () {
    return function (items, name, date, amount, balance) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (name != null) {
                var match = new RegExp(name, 'i');
                if (!match.test(item.CorrespondentUser.FirstName + item.CorrespondentUser.LastName))
                    continue;
            }
            if (amount != null) {
                var match = new RegExp(amount, 'i');
                if (!match.test(item.Amount))
                    continue;
            }
            if (balance != null) {
                var match = new RegExp(balance, 'i');
                if (!match.test(item.ResultingBalance))
                    continue;
            }
            if (date != null) {
                var match = new RegExp(date, 'i');
                if (!match.test(item.DateTime))
                    continue;
            }
            filtered.push(item);
        }
        return filtered;
    };
});