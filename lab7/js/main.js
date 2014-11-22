/**
 * AngularJS
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('webApp', ['ui.bootstrap', 'ngRoute', 'formApp']);

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
app.controller('PageCtrl', function ($scope /* also: $location, $http */) {
	$scope.carInterval = 5000;    /* msec */
	$scope.slides = [1, 2, 3, 4, 5, 6, 7, 8];

	/* Prepare messages */
	$scope.enjoy = [
			"Enjoy the most deluxe sushi on the west coast!",
			"Our cooks take inspiration from the wild of the west coast nature!",
			"Submerge yourself into the world of sushi!",
			"We will open the flavour of Asia to you in just one bite!",
			"Your local source of finest asian traditions right on your the!",
			"Touch with the culture of thousands years of sushi crafting perfection - just over lunch!",
			"Bring colours to your life through our vibrant selection!",
			"Feel our affection for what we make!"
			];
});


/*
 * Order Form application
 */
var formApp = angular.module("formApp", []);

formApp.controller("costController", function($scope, $http) {

	/* initialize the price table */
	$scope.priceTable = {
	    "california": { "six": 5.0, "eight": 7.0,  "ten": 10.0 },
	    "salmon":     { "six": 7.0, "eight": 10.0, "ten": 12.0 },
	    "calamari":   { "six": 9.0, "eight": 12.0, "ten": 14.0 }
	};

	/* current date */
	$scope.getDate = new Date;

	/* clears all data */
	$scope.reset = function(removeAlerts) {
	    $scope.order = {};
	    $scope.order.serving = "six";
	    $scope.order.quantity = 1;
	    $scope.order.spice = { soy: false, ginger: false, wasabi: false, hot: false, mayo: false };

	    /* 'orderform' is not available on the initiall call of reset() below */
	    if ($scope.orderform) {
		$scope.orderform.$setPristine();
	    }

	    /* remove alerts if needed */
	    if (removeAlerts) {
		$scope.showReceipt = false;
	    }
	};

	/* calculates the cost */
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
	    if ($scope.order.type === "pickup") total *= (1.00 - 0.15);

	    return total.toFixed(2);
	};

	/* submit the form */
	$scope.submitForm = function() {
	    $http.post("php/submit.php", $scope.order)
	    .success(function(data) {
		    if (data["success"] == 0) {
			$scope.order.error = "Validation error: " + data["error-reason"];
		    } else {
			$scope.receipt = data["receipt"].substr(0, 20);
			$scope.showReceipt = true;
			$scope.reset(false);
		    }
		})
	    .error(function(data, status) {
		    console.log(data);
		    $scope.order.error = "Error accessing the server: " + status + ".";
		});
	}

	/* close the receipt alert */
	$scope.closeReceipt = function() {
	    $scope.showReceipt = false;
	}

	/* initialize */
	$scope.reset(false);
    });