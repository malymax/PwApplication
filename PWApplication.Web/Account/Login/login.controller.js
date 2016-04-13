angular.module('pwapp')
        .controller('loginController', ['$location', 'AuthenticationService', '$rootScope', '$scope', 'SubscriptionService', 'UserService', function ($location, AuthenticationService, $rootScope, $scope, SubscriptionService, UserService) {
            var controller = this;
            $scope.login = login;
            $scope.errorMessage = null;
            $scope.dataLoading = false;

            if ($rootScope.currentUser != null) {
                $location.path('/home');
            }

            var scope = $scope;
            function login() {
                $scope.dataLoading = true;
                AuthenticationService.login($scope.email, $scope.password, function (response) {
                    $scope.dataLoading = false;
                    if (response.success) {
                        $scope.hasErrors = false;
                        var authdata = AuthenticationService.setAuthorizationHeader($scope.email, $scope.password);
                        UserService.GetByLogin($scope.email).then(function (user) {
                            AuthenticationService.setCredentials(user, authdata);

                            if ($rootScope.currentUser != null)
                                $rootScope.$watch($rootScope.currentUser.balance, function (newValue, oldValue) {
                                    scope.apply();
                                });

                            SubscriptionService.subscribe();
                            $location.path('/home');
                        });
                    } else {
                        $scope.errorMessage = response.message;
                        $scope.hasErrors = true;
                    }
                });
            };
        }]);