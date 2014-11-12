/**
 * AngularJS
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('webApp', ['ngRoute', 'formApp']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    .when("/home", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/menu", {templateUrl: "partials/menu.html", controller: "PageCtrl"})
    .when("/specials", {templateUrl: "partials/specials.html", controller: "PageCtrl"})
    .when("/order", {templateUrl: "partials/order.html", controller: "PageCtrl"})
    .when("/opportunity", {templateUrl: "partials/opportunity.html", controller: "PageCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

});


/*
 * Order Form application
 */
var formApp = angular.module("formApp", []);

formApp.controller("costController", function($scope, $compile) {

	/* initialize the price table */
	$scope.priceTable = {
	    "california": { "six": 5.0, "eight": 7.0,  "ten": 10.0 },
	    "salmon":     { "six": 7.0, "eight": 10.0, "ten": 12.0 },
	    "calamari":   { "six": 9.0, "eight": 12.0, "ten": 14.0 }
	};

	/* current date */
	$scope.getDate = new Date;

	$scope.reset = function() {
	    $scope.order = {};
	    $scope.order.serving = "six";
	    $scope.order.quantity = 1;
	    $scope.order.spice = { soy: false, ginger: false, wasabi: false, hot: false, mayo: false };
	    /*    $scope.orderform.$setPristine();    */
	};

	$scope.calculateTotal = function() {
	    total = 0.0;

	    /* basic pricing */
	    if (typeof($scope.order.flavour) !== "undefined") {
		total = $scope.priceTable[$scope.order.flavour][$scope.order.serving];
	    }

	    /* spices */
	    if ($scope.order.spice.soy) total += 0.50;
	    if ($scope.order.spice.ginger) total += 0.50;
	    if ($scope.order.spice.wasabi) total += 0.50;
	    if ($scope.order.spice.hot) total += 0.50;
	    if ($scope.order.spice.mayo) total += 0.50;

	    /* quantity */
	    total *= $scope.order.quantity;

	    /* a 15% discount for pick-up */
	    if ($scope.order.handin === "pickup") total *= (1.00 - 0.15);

	    return total.toFixed(2);
	};

	/* initialize */
	$scope.reset();
    });