<?php

date_default_timezone_set('America/Vancouver');

/* Get JSON data */
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData);
$firstname = $data->firstname;
$lastname = $data->lastname;
$phone = $data->phone;
$credit = $data->credit;
$expirym = $data->expirym;
$expiryy = $data->expiryy;
$serving = $data->serving;
$flavour = $data->flavour;
$spice = $data->spice;
$quantity = $data->quantity;
$type = $data->type;

/* Get the date */
$date = date('D j M Y G:i');

/* Check if all data was supplied */
if (empty($firstname)) {
	$response["success"] = 0;
	$response["error-reason"] = "first name was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($lastname)) {
	$response["success"] = 0;
	$response["error-reason"] = "last name was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($phone)) {
	$response["success"] = 0;
	$response["error-reason"] = "phone number was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($credit)) {
	$response["success"] = 0;
	$response["error-reason"] = "credit card number was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($expirym)) {
	$response["success"] = 0;
	$response["error-reason"] = "credit card expiry month was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($expiryy)) {
	$response["success"] = 0;
	$response["error-reason"] = "credit card expiry year was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($flavour)) {
	$response["success"] = 0;
	$response["error-reason"] = "flavour was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($quantity)) {
	$response["success"] = 0;
	$response["error-reason"] = "quantity was not supplied";
	echo json_encode($response);
	exit;
}
if (empty($type)) {
	$response["success"] = 0;
	$response["error-reason"] = "pick-up type was not supplied";
	echo json_encode($response);
	exit;
}


/*
 * Check credit card expiry
 */
$month = intval(date("m"));
$year = intval(date("y"));
if (($expirym < 1) || ($expirym > 12)) {
	$response["success"] = 0;
	$response["error-reason"] = "invalid expiration month";
	echo json_encode($response);
	exit;
}
if (($expiryy < $year) || (($expiryy == $year) && ($expirym < $month))) {
	$response["success"] = 0;
	$response["error-reason"] = "credit card expired";
	echo json_encode($response);
	exit;
}


/*
 * Validation: check the name of the user
 */
if (strlen($firstname) > 20 || strlen($lastname) > 20 ||
    !ctype_alnum($firstname) || !ctype_alnum($lastname)) {
	$response["success"] = 0;
	$response["error-reason"] = "invalid name";
	echo json_encode($response);
	exit;
}
/* Check if the user exists */
$name = "$firstname $lastname";
$cmd = "grep \":" . $name . ":\" /etc/passwd >/dev/null";
exec($cmd, $output, $exec_return);
if ($exec_return != 0) {
	$response["success"] = 0;
	$response["error-reason"] = "\"$name\" not a CST user";
	echo json_encode($response);
	exit;
}


/* 
 * Write the information to the file 'orders.txt', which should have
 * write permission to "others".  First check if the orders file can
 * be opened with append.
 */
@ $fp = fopen("orders.txt", "a");
if (!$fp) {
	$response["success"] = 0;
	$response["error-reason"] = "could not access database";
	echo json_encode($response);
	exit;
}


$outputString = 
	$date       . "\t" .
	$firstname  . "\t" .
	$lastname   . "\t" .
	$phone      . "\t" .
	$credit     . "\t" .
	$expirym    . "\t" .
	$expiryy    . "\t" .
	$serving    . "\t" .
	$flavour    . "\t";

/* list spices with dashes */
if (count($spice) > 0) {
	$is_first = 1;
	foreach($spice as $key => $value) {
		if ($value == 1) {
			if (!$is_first) {
				$outputString .= "-";
			} else {
				$is_first = 0;
			}
			$outputString .= $key;
		}
	}
} else {
	$outputString .= "no-spices";
}
$outputString .= "\t";

$outputString .= 
	$quantity   . "\t" .
	$type       . "\t";

$sha = hash("sha256", $outputString);
$sha = substr($sha, 0, 20);            /* Take only first 20 numbers from 'sha-256' */

$outputString .= "\t" . $sha . "\n";

fwrite($fp, $outputString);

fclose($fp);

/* return the receipt */
$response["success"] = 1;
$response["receipt"] = $sha;
echo json_encode($response);
?>
