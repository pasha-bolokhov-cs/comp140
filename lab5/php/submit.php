<!DOCTYPE html>
<html lang="en">
<head>

<title>
  Form results
</title>
<style type="text/css">

.formval { font-size:14px;
		   font-weight: 900;
		   font-family:Verdana, Arial, Helvetica, sans-serif;
           color: blue;
         }
</style>
</head>
<body>
  <h1>Form data entered by client</h1>

<?php


date_default_timezone_set('America/Vancouver');

	/* In PHP the assignment operator is the equals sign.  */

	/* PHP variable names appear on the left of the equals sign */

	/* The $_REQUEST is one of the PHP predefined variables.

	    Through $_REQUEST the form information is passed more securely to
the
               PHP script handler (like this one).

	     http://ca.php.net/manual/en/language.variables.predefined.php

               Other variables such as $_GET and $POST are no longer used
because they
               cause the form information to appear in the URL to the PHP
script.

           */
	/* The names appearing within the $_REQUEST[  ] are the
	      form element names. */

    /* The form element values are assigned to the PHP variables below.   */

    $firstname  = $_REQUEST[ 'firstname'  ];   /* text box   */
    $lastname   = $_REQUEST[ 'lastname'   ];   /* text box   */
    $phone      = $_REQUEST[ 'phone'     ];   /* radio        */
    $credit     = $_REQUEST[ 'credit'      ];   /* checkbox */
    $expiry     = $_REQUEST[ 'expiry'    ];   /* select       */
    $pizza      = $_REQUEST[ 'pizza'     ];
    $size       = $_REQUEST[ 'size'      ];
    if ( isset( $_REQUEST[ 'topping' ] ) ){
                $topping    = $_REQUEST[ 'topping'   ];
    } else {
         $topping = array();
    }
    $quantity   = $_REQUEST[ 'quantity'  ];
    $order      = $_REQUEST[ 'order'     ];


	/* Information for using dates in PHP is at  http://ca3.php.net/date
 * */
	$date = date('D j M Y G:i');

    /* Check if the $firstname was not entered on the form.  Note that \" is a
 * way of providing double quotes
	    inside double quotes.
          */
      if ( empty($firstname) ) {

  	     echo "<p><strong>You didn't enter a value for first name." .
              "<br />" .
              "Please <a href=\"order.html\">go back</a> and re-enter a value
for first name." .
              "</strong></p></body></html>";
         exit;
      }

      echo "<p>Order processed<br />";

      echo "The current time and date is " . date("H:i, jS F");

	  echo "<br />";

      /* Show the entered form information back to the browser window.
                     If the form has differently named form elements, you will
have
                    to change them in this PHP file.
                */
      echo "First name is <span class=\"formval\">" . $firstname  .
"</span><br />";

	  if ( $lastname)
		echo "Last name is <span class=\"formval\">"  . $lastname   .
"</span><br />";

	  if ( $phone )
        echo "phone is <span class=\"formval\">" . $phone . "</span><br />";

	  if ( $credit )
        echo "Credit card is <span class=\"formval\">" . $credit . "</span><br
/>";

	  if ( $expiry )
        echo "Expiry is <span class=\"formval\">" . $expiry . "</span><br />";

	  if ( $pizza )
        echo "Pizza type is <span class=\"formval\">" . $pizza . "</span><br
/>";

	  if ( $size )
        echo "Pizza size is <span class=\"formval\">" . $size . "</span><br
/>";


      if ( count( $topping) > 0 ) {
        echo "Selected toppings is/are <span class=\"formval\">";

        foreach($topping as $key => $value)
        {
          echo $value . " ";
        }

        echo "</span><br />";

      }
      echo "Quantity is <span class='formval'>" . $quantity    . "</span><br
/>";

      echo "Order is <span class='formval'>" . $order  . "</span><br />";


      /* Write the information to the file myOrders.txt, which should have
                    write permission to "others".  First check if the orders
file can
	          be opened with append.
               */
      @ $fp = fopen("./myOrders.txt", "a");
      if (!$fp)
      {
         echo "<p><strong>Your order cannot be processed at this time. " .
           "Please try again later.</strong> <br />" .
		   "<a href=\"order.html\">Return to the form</a>" .
		   "</p></body></html>";
         exit;
      }

	  /* $outputString is assigned the information you entered on the form
 * separated by tabs (the \t means tab)  */

	  /* For any form information not entered, the associated PHP variable
 * will contain nothing (blank).  */

	  /*  The pizzaTop[0] contains the first checkbox form element value
 *  or blank if it wasn't checked.   */

	  /*  The \n is necessary at the very end of the string so that each
 *  record starts on a new line.  */

      $outputString = $date       . "\t" .
                      $firstname  . "\t" .
                      $lastname   . "\t" .
		              $credit     . "\t" ;

      if ( count( $topping) > 0 ) {

        foreach($topping as $key => $value)
        {
          $outputString .= $value  . "\t";
        }
      }

      $outputString .=
                      $pizza   .
                      "\n";

	  /*  Write out the form information through the file pointer to the
 *  file myOrders.txt.  */
      fwrite($fp, $outputString);

	  /* Close the file pointer now that we are finished working with the
 * file.  */
      fclose($fp);

	  /*  PHP can include an e-mail function so that you may optionally
 *  email the form information. */

        // imap_mail("zz@shaw.ca", "Test Message", $outputString,
        // "From:Ghostly");

?>
<p>
 <a href="../order.html">Return to the form</a>
</p>
</body>
</html>
