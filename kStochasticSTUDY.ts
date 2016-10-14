#######################################################
#
# Hodorific Enterprises, Inc. (c) 2009 - 2016
#
# This Stochastic tries to simplify the user interface
# by only requiring one number. The other numbers are
# scaled off this one number.  
#
# Also this routine simplifies the graphics to show 
# either a green or red line.  When the line changes 
# from Red to Green under OverSold line that is your
# buy signal. When it turns from a Green to a Red 
# above the OverBought line that is your sell signal.
#
# 02/10/2015 updated by Tim Sayre and Ken Hodor
# 03/02/2015 updated by Tim Sayre - Implemented alert section.
# 03/25/2015 updated by Tim Sayre - Added secondary alert to 
#            fire when FullK crosses below 80 or above 20. 
# 10/10/2016 updated by Tim Sayre - Updated the smoothing 
#            constants and added vertical lines to match the
#            TradeStation implementation.
#######################################################

declare lower;
input kPeriod = 13;
input showTradeLines = yes;

def priceH = high;
def priceL = low;
def priceC = close;

def over_bought = 80;
def over_sold = 20;

def smoothConstK = Max( 3, RoundDown( kPeriod * 0.6, 0 ));    ## constant for smoothing fast K line.
def smoothConstD = Max( 2, RoundDown( kPeriod / 20, 0 ));     ## constant for smoothing fast D line.

def c1 = priceC - Lowest(priceL, kPeriod);
def c2 = Highest(priceH, kPeriod) - Lowest(priceL, kPeriod);
def FastK = c1 / c2 * 100;

plot FullK;
plot FullD;

## Hide the FullD line to de-clutter the chart.
FullD.Hide();

FullK = MovingAverage(AverageType.SIMPLE, FastK, smoothConstK);
FullD = MovingAverage(AverageType.SIMPLE, FullK, smoothConstD);

plot OverBought = over_bought;
plot OverSold = over_sold;

def trend = { default up, down, bull_rev, bear_rev };
if ( FullK >= over_bought  ) {
    if ( trend[1] == trend.bull_rev )
    then {
        trend = trend.bull_rev;
    }
    else {
        if ( Crosses( FullK, FullD, CrossingDirection.BELOW ) )
        then {
            trend = trend.bull_rev;
        }
        else {
            trend = trend.up;
        }
    }
}
else if ( FullD <= over_sold ) {
    if ( trend[1] == trend.bear_rev )
    then {
        trend = trend.bear_rev;
    }
    else {
        if ( Crosses( FullK, FullD, CrossingDirection.ABOVE ) )
        then {
            trend = trend.bear_rev;
        }
        else {
            trend = trend.down;
        }
    }
}
else if ( FullK > FullD )
then {
    trend = trend.up;
}
else {
    trend = trend.down;
}

#######################################################
# Alert Section
#######################################################
def alert_trigger = { default alert_off, bull_rev, bear_rev };
def direction = { default up_tick, down_tick };
if ( trend == trend.bull_rev && trend[1] != trend.bull_rev ) {
    ## fire alert and flip color
    alert_trigger = alert_trigger.bull_rev;
    direction = direction.down_tick;
}
else if ( trend == trend.bear_rev && trend[1] != trend.bear_rev ) {
     ## fire alert and flip color
    alert_trigger = alert_trigger.bear_rev;
    direction = direction.up_tick;
}
else if ( trend == trend.bull_rev ) {
    direction = direction.up_tick;
    alert_trigger = alert_trigger.alert_off;
}
else if ( trend == trend.bear_rev ) {
    direction = direction.down_tick;
    alert_trigger = alert_trigger.alert_off;
}
else if ( FullK > FullD ) {
    direction = direction.up_tick;
    alert_trigger = alert_trigger.alert_off;
}
else {
    direction = direction.down_tick;
    alert_trigger = alert_trigger.alert_off;
}

Alert( alert_trigger == alert_trigger.bull_rev, Concat( GetSymbol(), " - Bull trend reversal"), Alert.BAR, Sound.Ring );
Alert( alert_trigger == alert_trigger.bear_rev, Concat( GetSymbol(), " - Bear trend reversal"), Alert.BAR, Sound.Ring );

Alert( FullK crosses below over_bought, Concat( GetSymbol(), " - Crossed below over bought level"), Alert.BAR, Sound.Ring );
Alert( FullK crosses above over_sold, Concat( GetSymbol(), " - Crossed above over sold level"), Alert.BAR, Sound.Ring );
######################################################

######################################################
# Vertical Line Section
######################################################
AddVerticalLine( if ( showTradeLines == yes && trend == trend.bull_rev &&  direction == direction.down_tick ) then yes else no, "", Color.YELLOW, Curve.FIRM );
AddVerticalLine( if ( showTradeLines == yes && trend == trend.bear_rev &&  direction == direction.up_tick ) then yes else no, "", Color.WHITE, Curve.FIRM );
AddVerticalLine( if ( showTradeLines == yes && Crosses( FullK, over_sold, CrossingDirection.ABOVE )) then yes else no, "", Color.DARK_GRAY, Curve.FIRM );
AddVerticalLine( if ( showTradeLines == yes && Crosses( FullK, over_bought, CrossingDirection.BELOW )) then yes else no, "", Color.LIGHT_GRAY, Curve.FIRM );
######################################################

FullK.AssignValueColor(  if direction == direction.up_tick then Color.UPTICK else Color.DOWNTICK );
FullD.SetDefaultColor(GetColor(4));
FullK.SetLineWeight(2);
OverBought.SetDefaultColor(GetColor(1));
OverSold.SetDefaultColor(GetColor(1));