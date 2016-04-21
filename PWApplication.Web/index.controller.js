angular.module('pwapp')
        .controller('indexController', ['$location', '$rootScope', '$scope', '$cookies', 'AuthenticationService', 'SubscriptionService', function ($location, $rootScope, $scope, $cookies, AuthenticationService, SubscriptionService) {
            $scope.logout = logout;
            var savedCookie = $cookies.get('currentUser');
            $rootScope.currentUser = angular.fromJson(savedCookie);

            if ($rootScope.currentUser == null) {
                AuthenticationService.clearCredentials();
                $location.path('/login');
            }

            if ($rootScope.currentUser != null) {
                var authdata = AuthenticationService.setAuthorizationHeaderData($rootScope.currentUser.authdata);
                SubscriptionService.subscribe();
            }

            function logout() {
                if ($rootScope.currentUser != null) {
                    SubscriptionService.unsubscribe();
                    AuthenticationService.clearCredentials();
                    $location.path('/login');
                }
            }
        }]);