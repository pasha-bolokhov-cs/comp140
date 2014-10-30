<!DOCTYPE html>
<html lang="en">
<head>

<title>
   Order Details
</title>
<style type="text/css">
   .formval { 
   font-size: 14px;
   font-weight: 900;
   font-family: Verdana, Arial, Helvetica, sans-serif;
   color: blue;
   }
</style>
</head>
<body>
  <h1>Order Data provided</h1>

<?php


date_default_timezone_set('America/Vancouver');


/* The form element values are assigned to the PHP variables below.   */

$firstname  = $_REQUEST['firstname'   ];   /* text box   */
$lastname   = $_REQUEST['lastname'    ];   /* text box   */
$phone      = $_REQUEST['phone'       ];   /* radio        */
$credit     = $_REQUEST['credit'      ];   /* checkbox */
$expirym    = $_REQUEST['expirym'     ];   /* select       */
$expiryy    = $_REQUEST['expiryy'     ];   /* select       */
$serving    = $_REQUEST['serving'     ];
$flavour    = $_REQUEST['flavour'     ];
if (isset($_REQUEST[ 'spice' ])) {
  $spice    = $_REQUEST[ 'spice'      ];
} else {
  $spice = array();
}
$quantity   = $_REQUEST[ 'quantity'   ];
$order      = $_REQUEST[ 'order'      ];


/* Information for using dates in PHP is at  http://ca3.php.net/date */
$date = date('D j M Y G:i');

/* Check if $firstname was not entered */
if (empty($firstname)) {
  echo "<p><strong>You didn't enter a value for first name." .
    "<br />" .
    "Please <a href=\"../index.html#/order\">go back</a> and re-enter a value for first name." .
    "</strong></p></body></html>";
  exit;
}

echo "<p>Order processed<br />";

echo "The current time and date is " . date("H:i, jS F");

echo "<br />";

/* Show the entered form information back to the browser window */
echo "First name is <span class=\"formval\">" . $firstname  . "</span><br />";

if ($lastname)
  echo "Last name is <span class=\"formval\">"  . $lastname  . "</span><br />";

if ($phone )
  echo "phone is <span class=\"formval\">" . $phone . "</span><br />";

if ($credit)
  echo "Credit card is <span class=\"formval\">" . $credit . "</span><br/>";

if ($expirym && $expiryy)
  echo "Expiry is <span class=\"formval\">" . $expirym . " / " . $expiryy . "</span><br />";

if ($flavour)
  echo "Sushi flavour is <span class=\"formval\">" . $flavour . "</span><br/>";

if ($serving)
  echo "Sushi package serving is <span class=\"formval\">" . $serving . "</span><br/>";


if (count($spice) > 0) {
  echo "Selected spice(s) is/are <span class=\"formval\">";
  
  foreach($spice as $key => $value) {
    echo $value . " ";
  }
  
  echo "</span><br />";
}

echo "Quantity is <span class='formval'>" . $quantity    . "</span><br/>";

echo "Order is <span class='formval'>" . $order  . "</span><br />";


/* 
 * Write the information to the file myOrders.txt, which should have
 * write permission to "others".  First check if the orders file can
 * be opened with append.
 */
@ $fp = fopen("./orders.txt", "a");
if (!$fp) {
  echo "<p><strong>Your order cannot be processed at this time. " .
    "Please try again later.</strong> <br />" .
    "<a href=\"../index.html#/order\">Return to the order page</a>" .
    "</p></body></html>";
  exit;
}


$outputString = 
  $date       . "\t" .
  $firstname  . "\t" .
  $lastname   . "\t" .
  $credit     . "\t" ;

if (count($spice) > 0) {

  foreach($spice as $key => $value) {
    $outputString .= $value . "\t";
    }
}

$outputString .= $flavour . "\n";

fwrite($fp, $outputString);

fclose($fp);

/* 
 * PHP can include an e-mail function so that you may optionally
 * email the form information
 */
?>
<p>
 <a href="../index.html#/order">Return to the order page</a>
</p>
</body>
</html>
