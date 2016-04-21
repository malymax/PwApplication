angular.module('pwapp')
        .controller('homeController', ['$location', '$rootScope', '$cookies', '$scope', 'TransactionService', 'DataProvider', function ($location, $rootScope, $cookies, $scope, TransactionService, DataProvider) {
            $scope.transactions = [];
            $scope.reverse = true;
            $scope.sortProperty = 'DateTime';
            $scope.sort = sort;
            $scope.getSortClass = getSortClass;

            $scope.selectedTransaction = null;
            $scope.setSelected = setSelected;
            $scope.createCopy = createCopy;
            $scope.create = create;

            $scope.filterExpression = {
                CorrespondentUser: undefined,
                DateTime: undefined,
                Amount: undefined,
                ResultingBalance: undefined
            };

            $scope.search = {   
                isUser:false, user: undefined,
                isDateTime: false, datetime: undefined,
                isAmount: false, amount: undefined,
                isResultingBalance: false, balance: undefined
            };

            if ($rootScope.currentUser == null) {
                $location.path('/login');
                return;
            }

            TransactionService.GetByUser($rootScope.currentUser.login).then(function (response) {
                if (response != null && response != [] && response.length > 0)
                    $scope.transactions = response;
            });

            function sort(property) {
                if ($scope.sortProperty == property)
                    $scope.reverse = !$scope.reverse;
                else {
                    $scope.reverse = false;
                    $scope.sortProperty = property;
                }
            }

            function getSortClass(property) {
                if ($scope.sortProperty == property)
                    return $scope.reverse ? 'arrow-down' : 'arrow-up';
            }

            function setSelected (selectedTransaction) {
                $scope.selectedTransaction = selectedTransaction;
            };

            function createCopy() {
                if ($scope.selectedTransaction != null) {
                    DataProvider.data = $scope.selectedTransaction;
                    $location.path('/transactions');
                }
            }

            function create() {
                $location.path('/transactions');
            }
        }]);