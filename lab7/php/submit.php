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

/* Check if $firstname was not entered */
if (empty($firstname)) {
  $response["success"] = 0;
  $response["error-reason"] = "first name was not supplied";
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

if (count($spice) > 0) {
  foreach($spice as $key => $value) {
    $outputString .= $value . "\t";
    }
} else {
  $outputString .= "no-spices" . "\t";
}

$outputString .= 
  $quantity   . "\t" .
  $type       . "\t" .
  $date;

$sha = hash("sha256", $outputString);

$outputString .= "\t" . $sha;

fwrite($fp, $outputString);

fclose($fp);

/* return the receipt */
$response["success"] = 1;
$response["receipt"] = $sha;
echo json_encode($response);
?>
