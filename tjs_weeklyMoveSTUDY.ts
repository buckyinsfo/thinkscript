#hint: <b>Expected Move - Weekly</b> \n This study draws a expected move levels based on implied volatility.
#hint if_proxy_notify: Add label on the chart if an ETF's volatility is used as a proxy for the future.
#hint if_breach_notify: Add notification if the expected move is breached.
##################################################################################
##
##  This code is a script that will draw vertical line on the chart at the 
##  beginning of each week.  Then the expected move levels are drawn.
##  1) The user may select to notify if an ETF is used as a proxy for volatilty.
##  2) The user may select whether to indicate breaches of the expected move at 
##     expiration.
##
##  10/15/2017 Implemented by Tim Sayre - ThinkorSwim thinkScript
##
##   NO ACTUAL OR IMPLIED WARRANTIES OFFERED - USE AT YOUR OWN DISCRETION 
##################################################################################
declare hide_on_intraday;
declare upper;

input if_proxy_notify = yes;
input if_breach_notify = yes;

# implied volatility
# using proxies for futures
def iv = if (GetSymbol() == "/ES") then close("VIX") / 100
else if (GetSymbol() == "/CL") then close("OIV") / 100 
else if (GetSymbol() == "/GC") then close("GVX") / 100 
else if (GetSymbol() == "/SI") then close("VXSLV") / 100 
else if (GetSymbol() == "/NQ") then close("VXN") / 100 
else if (GetSymbol() == "/RTY") then close("RVX") / 100 
else if (GetSymbol() == "/YM") then close("VXD") / 100 
else if (GetSymbol() == "/6E") then close("EVZ") / 100 
else if (GetSymbol() == "/6J") then close("JYVIX") / 100 
else if (GetSymbol() == "/6B") then close("BPVIX") / 100 
else if (GetSymbol() == "/ZN") then close("TYVIX") / 100 
else if (GetSymbol() == "/ZW") then close("WIV") / 100
else if (GetSymbol() == "/ZB") then imp_volatility("TLT") 
else if (GetSymbol() == "/ZC") then imp_volatility("CORN") 
else if (GetSymbol() == "/ZS") then imp_volatility("SOYB") 
else if (GetSymbol() == "/KT") then imp_volatility("JO") 
else if (GetSymbol() == "/NG") then imp_volatility("UNG") 
else if (GetSymbol() == "/6S") then imp_volatility("FXF") 
else imp_volatility();

def iv_df = if ( !IsNaN( iv ) ) then iv else iv[-1];
## $323.62 x 31.6% x SQRT (22/365) = $25.11

def today = GetDayOfWeek(GetYYYYMMDD());
def first_DOW = today >= 1 and  today[1] > today;
def exp_mv;
def up_mv;
def down_mv;
if ( first_DOW ) then {
    
    ## Friday is day 5 minus today minus 1 more to get zero based index.
    exp_mv = open(GetSymbol()) * iv_df * Sqrt( ( 5 - today - 1 ) / 365); 

    up_mv = open ( GetSymbol() ) + exp_mv;
    down_mv = open ( GetSymbol() ) - exp_mv;

} else {
    exp_mv = exp_mv[1];
    up_mv = up_mv[1];
    down_mv = down_mv[1];
}


## Display vertical line at the begining of the week.
AddVerticalLine( if ( first_DOW ) then yes else no, "", Color.WHITE, Curve.SHORT_DASH );

## Plot expected move levels.
plot up_sd = up_mv;
up_sd.SetPaintingStrategy( PaintingStrategy.HORIZONTAL );
up_sd.SetDefaultColor( Color.WHITE );
up_sd.SetLineWeight( 5 );

plot down_sd = down_mv;
down_sd.SetPaintingStrategy( PaintingStrategy.HORIZONTAL );
down_sd.SetDefaultColor( Color.WHITE );
down_sd.SetLineWeight( 5 );

## Show breach.



## Add label if we used an EFT proxy for Volatility.
def is_etf;
if  (GetSymbol() == "/ZB") or
    (GetSymbol() == "/ZC") or 
    (GetSymbol() == "/ZS") or 
    (GetSymbol() == "/KT") or
    (GetSymbol() == "/NG") or 
    (GetSymbol() == "/6S") then {
    is_etf = yes;
} else {
    is_etf = no;
}
AddLabel( is_etf && if_proxy_notify, "Used the ETF's volatility", Color.LIGHT_GRAY );


## Debug Stuff.
##AddChartBubble( yes, high, df1, Color.LIGHT_GREEN, yes );
##AddChartBubble( yes, high, exp_mv, Color.LIGHT_RED, yes );