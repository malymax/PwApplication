


    angular
        .module('pwapp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'appSettings'];
    function UserService($http, appSettings) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByLogin = GetByLogin;
        service.Create = Create;

        return service;

        function GetAll() {
            return $http.get(appSettings.serviceUri + 'api/users').then(handleArray, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(appSettings.serviceUri + 'api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByLogin(login) {
            return $http.get(appSettings.serviceUri + 'api/users?email=' + login, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': $http.defaults.headers.common.Authorization } }).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post(appSettings.serviceUri + 'api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function handleSuccess(res) {
            if (res.data != null && res.data != "")
                return angular.fromJson(res.data);
            return {success: true}; 
        }

        function handleArray(res) {
            var result = [];
            if (res.data != null)
                angular.forEach(res.data, function (str) {
                    var obj = angular.fromJson(str)
                    result.push(obj);
                })
            return result;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

    }


    angular
        .module('pwapp')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', 'appSettings'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService, appSettings) {
        var service = {};

        service.login = login;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;
        service.setAuthorizationHeader = setAuthorizationHeader;

        return service;

        function login(login, password, callback) {
            var response;
            $http.post(appSettings.serviceUri + 'api/authentication', { login: login, password: password })
                    .then(function (response) {
                        callback(response.data);
                    });

        }

        function setAuthorizationHeader(email, password) {
            var authdata = Base64.encode(email + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + authdata;
            return authdata;
        }

        function setCredentials(user, authdata) {

            $rootScope.currentUser = {
                login: user.Email,
                authdata: authdata,
                balance: user.Balance,
                name: user.FirstName + ' ' + user.LastName,
                id: user.ID
            };

            $cookies.put('currentUser', angular.toJson($rootScope.currentUser));
        }

        function clearCredentials() {
            $rootScope.currentUser = null;
            $http.defaults.headers.common.Authorization = 'Basic ';
            $cookies.remove('currentUser');
        }
    }


    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };


    (function () {
        'use strict';

        angular
            .module('pwapp')
            .factory('TransactionService', TransactionService);

        TransactionService.$inject = ['$http', 'appSettings'];
        function TransactionService($http, appSettings) {
            var service = {};

            service.GetAll = GetAll;
            service.GetByUser = GetByUser;
            service.Create = Create;

            return service;

            function GetAll() {
                return $http.get(appSettings.serviceUri + 'api/transactions').then(handleSuccess, handleError('Error getting all transactions'));
            }

            function GetByUser(userEmail) {
                return $http.get(appSettings.serviceUri + 'api/transactions/?email=' + userEmail, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
                            .then(handleArray, handleError);
            }

            function Create(transaction) {
                return $http.post(appSettings.serviceUri + 'api/transactions', transaction).then(handleSuccess, handleError('Error creating transaction'));
            }

            function handleSuccess(res) {
                if (res.data != null && res.data != "")
                    return angular.fromJson(res.data);
                return { success: true };
            }

            function handleArray(res) {
                var result = [];
                if (res.data != null)
                    angular.forEach(res.data, function (str) {
                        var obj = angular.fromJson(str);
                        result.push(obj);
                    })
                return result;
            }

            function handleError(error) {
                return function () {
                    return { success: false, message: error };
                };
            }
        }

    })();

    angular
        .module('pwapp')
        .factory('SubscriptionService', SubscriptionService);
  
    SubscriptionService.$inject = ['$http', '$cookies', '$rootScope', 'appSettings'];
    function SubscriptionService($http, $cookies, $rootScope, appSettings) {

        var service = {};
        var state = { 4: 'disconnected' };

        service.subscribe = subscribe;
        service.unsubscribe = unsubscribe;

        return service;

        function subscribe() {
            if ($rootScope.currentUser == null)
                return;

            var hub = $.connection.subscribtionHub;

            $.connection.subscribtionHub.client.updateItem = function (item) {
                $rootScope.currentUser.balance = item.Balance;
                $cookies.put('currentUser', angular.toJson($rootScope.currentUser));
                $rootScope.$digest();
            }

            jQuery.support.cors = true;
            $.connection.hub.logging = true;

            $.connection.hub.url = appSettings.serviceUri + "signalr";

            $.connection.hub.start({ withCredentials: false }).done(function () {
                hub.server.subscribe($rootScope.currentUser.id);
            }).fail(function (error) {
                console.log('Invocation of start failed. Error: ' + error);
            });
        }

        function unsubscribe() {
            if ($rootScope.currentUser != null)
                if ($.connection.hub.state == 0 || $.connection.hub.state == 1 || $.connection.hub.state == 2 || $.connection.hub.state == 3)
                    $.connection.subscribtionHub.server.unsubscribe($rootScope.currentUser.id);
        }
    }

    angular
           .module('pwapp')
           .service('DataProvider', DataProvider);
  
    function DataProvider() {
        var provider = this;
        provider.data = {};
    }