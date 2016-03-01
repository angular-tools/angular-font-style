(function () {
    'use strict';

    angular.module('angularFontStyles', ['nya.bootstrap.select', 'angularColorPicker'])
        .directive('fontStyle', ['$compile', '$timeout', '$http', function ($compile, $timeout, $http) {
            return {
                restrict: 'A',
                replace: true,
                require: 'ngModel',
                scope: {font: '=', hideFontSize: '@', hideFontColor: '@', minFontSize: '@', maxFontSize: '@', fontSizeSkip: '@'},
                templateUrl: '/static/bower_components/angular-font-style/src/templates/font-style.html',
                link: function ($scope, element, attrs, ngModel) {
                    $scope.init = function () {
                        $scope.$watch('font', function () {
                            ngModel.$setViewValue($scope.font);
                        });
                    };

                    $scope.$watch('fonts', $scope.init);
                    ngModel.$render = function () {
                        $scope.setFont(ngModel.$viewValue);
                    };

                    $scope.setFont = function (f) {
                        if ($scope.fonts) {
                            $scope.font = f;
                        } else {
                            $timeout($scope.setFont.bind(null, f), 100);
                        }
                    };
                },
                controller: function ($scope, $element) {
                    $scope.init = function () {
                        $.getJSON('/bgtracks/fonts?callback=?', function (obj) {
                            var names = [];
                            angular.forEach(obj, function (v, k) {names.push(v.name);});
                            $timeout(function () { $scope.fonts = names; });
                        });

                        $scope.fontSizes = [];

                        for (var i = (parseInt($scope.minFontSize) || 10); i <= (parseInt($scope.maxFontSize) || 40); i += (parseInt($scope.fontSizeSkip) || 1)) {
                            $scope.fontSizes.push(i);
                        }
                    };

                    $scope.thumb = function (item) {
                        return '/bgtracks/fonts/thumbs/' + item + '.png';
                    };

                    $scope.init();
                }
            };
        }]);
})();


