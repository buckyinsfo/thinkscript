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
# 11/18/2016 updated by Tim Sayre - Added Phantom buy support
#            and capability to turn off audible alerts.
#
#######################################################

declare lower;
input kPeriod = 13;
input showTradeLines = yes;   ## Draw vertical lines at critical inflection points
input audibleAlerts = yes;    ## Audible alerts at inflection points
input phantomBuyAlert = yes;  ## Trigger inflection point on phantom buy.

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

plot OverBought = over_bought_level;
plot OverSold = over_sold_level;

plot FullK;
plot FullD;

## Hide the FullD line to de-clutter the chart.
FullD.Hide();

FullK = MovingAverage(AverageType.SIMPLE, FastK, smoothConstK);
FullD = MovingAverage(AverageType.SIMPLE, FullK, smoothConstD);

#######################################################
# Analyze State Section
#######################################################
def trend = { default up, down, bull_rev, bear_rev };
if ( FullK >= over_bought_level  ) {
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
else if ( FullK <= over_sold_level ) {
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

######################################################
# Alerts that provide a text message in the 
# Message Center and the audible sound.
######################################################
Alert( alert_trigger == alert_trigger.bull_rev && audibleAlerts == yes, Concat( GetSymbol(), " - Bull trend reversal"), Alert.BAR, Sound.Ring );
Alert( alert_trigger == alert_trigger.bear_rev && audibleAlerts == yes, Concat( GetSymbol(), " - Bear trend reversal"), Alert.BAR, Sound.Ring );
Alert( FullK crosses below over_bought_level && audibleAlerts == yes, Concat( GetSymbol(), " - Crossed below over bought level"), Alert.BAR, Sound.Ring );
Alert( FullK crosses above over_sold_level && audibleAlerts == yes, Concat( GetSymbol(), " - Crossed above over sold level"), Alert.BAR, Sound.Ring ); 
######################################################


######################################################
# Alerts that provide a text message in the 
# Message Center ONLY NO audible sound.
######################################################
Alert( alert_trigger == alert_trigger.bull_rev && audibleAlerts == no, Concat( GetSymbol(), " - Bull trend reversal"), Alert.BAR, Sound.NoSound );
Alert( alert_trigger == alert_trigger.bear_rev && audibleAlerts == no, Concat( GetSymbol(), " - Bear trend reversal"), Alert.BAR, Sound.NoSound );
Alert( FullK crosses below over_bought_level && audibleAlerts == no, Concat( GetSymbol(), " - Crossed below over bought level"), Alert.BAR, Sound.NoSound );
Alert( FullK crosses above over_sold_level && audibleAlerts == no, Concat( GetSymbol(), " - Crossed above over sold level"), Alert.BAR, Sound.NoSound ); 
######################################################


######################################################
# Vertical Line Section
######################################################
AddVerticalLine( if ( showTradeLines == yes && trend == trend.bull_rev &&  direction == direction.down_tick ) then yes else no, "", Color.YELLOW, Curve.FIRM );
AddVerticalLine( if ( showTradeLines == yes && trend == trend.bear_rev &&  direction == direction.up_tick ) then yes else no, "", Color.WHITE, Curve.FIRM );
AddVerticalLine( if ( showTradeLines == yes && Crosses( FullK, over_sold_level, CrossingDirection.ABOVE )) then yes else no, "", Color.DARK_GRAY, Curve.FIRM );
AddVerticalLine( if ( showTradeLines == yes && Crosses( FullK, over_bought_level, CrossingDirection.BELOW )) then yes else no, "", Color.LIGHT_GRAY, Curve.FIRM );
######################################################

######################################################
# Alerts for phantom buy.
######################################################
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

Alert( trigger == trigger.phantom_buy && audibleAlerts == no, Concat( GetSymbol(), " - Phantom buy alert" ), Alert.BAR, Sound.NoSound );
Alert( trigger == trigger.phantom_buy && audibleAlerts == yes, Concat( GetSymbol(), " - Phantom buy alert" ), Alert.BAR, Sound.Ring );

AddVerticalLine( showTradeLines == yes && trigger == trigger.phantom_buy, "", Color.LIGHT_GRAY, Curve.FIRM );
######################################################

######################################################
# Plot charateristics
######################################################
FullK.AssignValueColor(  if direction == direction.up_tick then Color.UPTICK else Color.DOWNTICK );
FullD.SetDefaultColor(GetColor(4));
FullK.SetLineWeight(2);
OverBought.SetDefaultColor(GetColor(1));
OverSold.SetDefaultColor(GetColor(1));