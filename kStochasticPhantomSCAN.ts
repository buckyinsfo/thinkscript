#######################################################
##
## Hodorific Enterprises, inc. (c) 2009 - 2016
##
## This scan code is designed to alert on phantom buys.
## A phantom buy is when the stockastic FullK/FullD lines 
## reverse above the over sold threshold and below the mid-range
## threshold.  The rules for pantom buys are:
## 1) Is the down trend coming off a recent over_bought?
## 2) Only the first down trend is considered. Has a recent 
##    phantom buy already been triggered?  Ignore anything 
##    else until the trend either goes above over bought or 
##    below over sold. (reset state only after either going 
##    above over_bought or below over_sold)
## 3) Is the FullK between mid_range and over_sold?
## 4) Has FullK crossed above the FullD line.
##  
## This scan was implemented to create the code necessary to 
## add the phanton buy capability to the kStochastic Study code.
##
## 11/18/2016 implemented by Tim Sayre
##
########################################################

declare lower;
input KPeriod = 13;

def priceH = high;
def priceL = low;
def priceC = close;

def over_bought_level = 80;
def mid_range_level = 50;
def over_sold_level = 20;

def smoothConstK = Max( 3, RoundDown( kPeriod * 0.6, 0 ));    ## constant for smoothing fast K line.
def smoothConstD = Max( 2, RoundDown( kPeriod / 20, 0 ));     ## constant for smoothing fast D line.

def c1 = priceC - Lowest(priceL, kPeriod);
def c2 = Highest(priceH, kPeriod) - Lowest(priceL, kPeriod);
def FastK = c1 / c2 * 100;

def FullK = MovingAverage(AverageType.SIMPLE, FastK, smoothConstK);
def FullD = MovingAverage(AverageType.SIMPLE, FullK, smoothConstD);

def trend = { default up, down, bull_rev, bear_rev }; 
if ( FullK >= over_bought_level  ) {
    if (trend[1] == trend.bull_rev ) {
        trend = trend.bull_rev; 
    }
    else {
        if ( Crosses( FullK, FullD, CrossingDirection.BELOW ) ) { 
            trend = trend.bull_rev; 
        }
        else { 
            trend = trend.up; 
        }
    }
}
else if ( FullK <= over_sold_level ) {
    if ( trend[1] == trend.bear_rev ) { 
        trend = trend.bear_rev; 
    }
    else { 
        if ( Crosses( FullK, FullD, CrossingDirection.ABOVE ) ) {
            trend = trend.bear_rev; 
        }
        else { 
            trend = trend.down; 
        }
    }
}
else if ( FullK > FullD ) { 
    trend = trend.up; 
}
else { 
    trend = trend.down; 
}

## Because phantom buys are dependent on coming off 
## the first most recent over_bought high we only care 
## about that condition.
def last = { default none, over_bought };
if ( FullK > over_bought_level ) {
    last = last.over_bought;
}
else if ( FullK > over_sold_level && last[1] == last.over_bought ) {
    last = last.over_bought;
}
else {
    last = last.none;
}

def pb_state;
if ( pb_state[1] == no && FullK < mid_range_level && FullK > over_sold_level && trend == trend.up && trend[1] == trend.down ) {
    pb_state = yes;
} else if ( pb_state[1] == yes && FullK < over_bought_level &&  FullK > over_sold_level ) {
    pb_state = yes;
}
else {
    pb_state = no;
}

## Analyze state for setting up the alert or plot.
def trigger = { default alert_off, phantom_buy };
if ( last == last.over_bought && pb_state[1] == no && pb_state == yes ) {
    trigger = trigger.phantom_buy;
}
else {
    trigger = trigger.alert_off;
}

plot scan = trigger == trigger.phantom_buy;