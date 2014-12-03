<?xml version='1.0'?>
<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>
<xsl:template match="/">

<html>
  <body>
    <table border="1" cellpadding="4">
      <tr style="font-variant: small-caps;
		 font-weight: bold;
		 text-align: center;
		 background-color:#11f;">
	<td>Date</td>
	<td>Custmer</td>
	<td>Spices</td>
      </tr>
      <xsl:for-each select="ledger/receipt">
	<tr style="background-color:#10f;">
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
	</tr>
      </xsl:for-each>
    </table>
  </body>
</html>
