<?xml version='1.0'?>
<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>
  <xsl:template match="/">

    <html>
      <body>
	<header style="text-align: center;">
	  <h2>Receipt Display by Pasha Bolokhov</h2>
	</header>
        <table border="1" cellpadding="4">
          <tr style="font-variant: small-caps;
    		     font-weight: bold;
    		     text-align: center;
    		     background-color:#a5a;">
    	    <td>Date</td>
    	    <td>Custmer</td>
    	    <td>Spices</td>
	    <td>Sushi</td>
	    <td>Amount</td>
	    <td>Total</td>
          </tr>
          <xsl:for-each select="ledger/receipt">
    	    <tr style="background-color:#fdd;">
    	      <td align="right">
    		<xsl:value-of select="date"/>
    	      </td>
    	      <td>
    		<xsl:value-of select="customer"/>
    	      </td>
    	      <td>
    		<xsl:for-each select="spices">
    		  <xsl:value-of select="@variety"/> &#160;
    		</xsl:for-each>
    	      </td>
	      <td>
		<xsl:value-of select="sushi"/>
	      </td>
	      <td style="text-align: right;">
		<xsl:value-of select="amount"/>
	      </td>
	      <xsl:variable name="total" select="(quantity*amount)"/>
	      <td style="text-align: right;">
		<xsl:value-of select='format-number($total, "#,###.00")'/>
	      </td>
    	    </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
