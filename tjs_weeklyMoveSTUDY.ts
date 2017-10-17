#hint: <b>Expected Move - Weekly</b> \n This study draws the expected move levels based on implied volatility.
#hint show_weeks: Add vertical lines to delineate weeks.
#hint breach_notify: Add notification if the expected move is breached.
##################################################################################
##
##  This code is a script that will draw vertical line on the chart at the 
##  beginning of each week.  Then the expected move levels are drawn.
##  1) The user may select Add vertical lines to delineate weeks.
##  2) The user may select whether to indicate breaches of the expected move at 
##     expiration.
##  3) Volitility for select futures contracts is derived from a corresponding
##     ETF's volitility.
##
##  10/15/2017 Implemented by Tim Sayre - ThinkorSwim thinkScript
##
##   NO ACTUAL OR IMPLIED WARRANTIES OFFERED - USE AT YOUR OWN DISCRETION 
##################################################################################
declare hide_on_intraday;
declare upper;

input show_weeks = yes;
input breach_notify = yes;

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
else if (GetSymbol() == "/VX") then close("VVIX") / 100
else if (GetSymbol() == "/ZB") then imp_volatility("TLT") 
else if (GetSymbol() == "/ZC") then imp_volatility("CORN") 
else if (GetSymbol() == "/ZS") then imp_volatility("SOYB") 
else if (GetSymbol() == "/KT") then imp_volatility("JO") 
else if (GetSymbol() == "/NG") then imp_volatility("UNG") 
else if (GetSymbol() == "/6S") then imp_volatility("FXF") 
else imp_volatility();

def iv_df = if ( !IsNaN( iv ) ) then iv else iv[-1];

def today = GetDayOfWeek(GetYYYYMMDD());
def first_DOW = today >= 1 && today[1] > today;
def wk_open;
def exp_mv;
def up_lim;
def down_lim;
if ( first_DOW )
then {
    wk_open = open(GetSymbol());

    ## Friday is day 5.  So make start day zero based index
    exp_mv =  wk_open * iv_df * Sqrt( ( 5 - ( today - 1 ) ) / 365);

    up_lim = wk_open + exp_mv;
    down_lim = wk_open - exp_mv;

} else {
    wk_open = wk_open[1];
    exp_mv = exp_mv[1];
    up_lim = up_lim[1];
    down_lim = down_lim[1];
}

## Plot expected move levels.
plot up_sd = up_lim;
up_sd.SetPaintingStrategy( PaintingStrategy.HORIZONTAL );
up_sd.SetDefaultColor( Color.WHITE );
up_sd.SetLineWeight( 5 );

plot down_sd = down_lim;
down_sd.SetPaintingStrategy( PaintingStrategy.HORIZONTAL );
down_sd.SetDefaultColor( Color.WHITE );
down_sd.SetLineWeight( 5 );

## Show breach.
def settle = close( GetSymbol() );

def breaches;
if ( today == 5 && ( up_lim < settle or settle < down_lim )  ) then {
    breaches = CompoundValue( 1, breaches[1], 0 ) + !isNaN( close );
} else {
    breaches = CompoundValue( 1, breaches[1], 0 );
}

def total_wks;
if ( first_DOW ) then {
    total_wks = CompoundValue( 1, total_wks[1], 0 ) + !isNaN( close );
} else {
    total_wks = CompoundValue( 1, total_wks[1], 0 );
}

AddChartBubble( today == 5 && breach_notify && up_lim < settle, high, "Breach " + breaches, Color.YELLOW, yes );
AddChartBubble( today == 5 && breach_notify && down_lim > settle , low, "Breach " + breaches, Color.YELLOW, no ); 

## Add label if we used an EFT proxy for Volatility.
def is_etf;
if  (GetSymbol() == "/ZB") or
    (GetSymbol() == "/ZC") or 
    (GetSymbol() == "/ZS") or 
    (GetSymbol() == "/KT") or
    (GetSymbol() == "/NG") or 
    (GetSymbol() == "/6S")
then {
    is_etf = yes;
} else {
    is_etf = no;
}

AddLabel( yes, Concat( breaches, Concat( " breaches in ", Concat( total_wks, Concat( " weeks.", if is_etf then " Used the ETF's volatility." else "" )))), Color.LIGHT_GRAY );

## Display vertical line at the begining of the week.
AddVerticalLine( first_DOW && show_weeks, total_wks, Color.WHITE, Curve.SHORT_DASH );

## Debug Stuff.
##AddChartBubble( yes, high, iv, Color.LIGHT_GREEN, yes );
##AddChartBubble( yes, high, exp_mv, Color.LIGHT_RED, yes );