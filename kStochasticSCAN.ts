#######################################################
##
## Hodorific Enterprises, inc. (c) 2009 - 2015
##
## This scan code is designed to alert or select symbols 
## that reach are at one pof the alert criteria from the 
## kStochasticSTUDY.ts.  The logic contained here was used 
## to optimize the alert section in kStochasticSTUDY.ts.
##
## This Stochastic tries to simplify the user interface
## by only requiring one number. The other numbers are
## scaled off this one number.  
##
## Also this routine simplifies the graphics to show 
## either a green or red line.  When the line changes 
## from Red to Green under OverSold line that is your
## buy signal. When it turns from a Green to a Red 
## above the OverBought line that is your sell signal.
##
## 02/10/2015 updated by Tim Sayre and Ken Hodor
## 03/02/2015 updated by Tim Sayre - Implemented alert section.
## 03/25/2015 updated by Tim Sayre - Added secondary alert to 
##            fire when FullK crosses below 80 or above 20. 
## 06/15/2015 Major modification by Tim Sayre - stripped out 
##            superfluous display and alert code to just fire 
##            the primary reversals for use in a custom scan.
## 11/18/2016 updated by Tim Sayre - Clean up to match 
##            all kStochastic implementations.
##
#######################################################

declare lower;
input KPeriod = 13;

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

def FullK = MovingAverage(AverageType.SIMPLE, FastK, smoothConstK);
def FullD = MovingAverage(AverageType.SIMPLE, FullK, smoothConstD);

def trend = { default up, down, bull_rev, bear_rev };
if ( FullK >= over_bought  ) {
    if (trend[1] == trend.bull_rev ) 
    then { trend = trend.bull_rev; }
    else {
        if ( Crosses( FullK, FullD, CrossingDirection.BELOW ) ) 
        then { trend = trend.bull_rev; }
        else { trend = trend.up; }
    }
}
else if ( FullK <= over_sold ) {
    if ( trend[1] == trend.bear_rev ) 
    then { trend = trend.bear_rev; }
    else { 
        if ( Crosses( FullK, FullD, CrossingDirection.ABOVE ) )
        then { trend = trend.bear_rev; }
        else { trend = trend.down; }
    }
}
else if ( FullK > FullD ) 
then { trend = trend.up; }
else { trend = trend.down; }


def trigger = { default alert_off, bull_rev, bear_rev };
def direction = { default up_tick, down_tick, undetermined };
if ( trend == trend.bull_rev && trend[1] != trend.bull_rev ) {
    ## fire reversal
    trigger = trigger.bull_rev;
    direction = direction.down_tick;
}
else if ( trend == trend.bear_rev && trend[1] != trend.bear_rev ) {
     ## fire reversal
     trigger = trigger.bear_rev;
     direction = direction.up_tick;
}
else {
    trigger = trigger.alert_off;
    direction = direction.undetermined;
    
}

plot scan = trigger == trigger.bull_rev or trigger == trigger.bear_rev;