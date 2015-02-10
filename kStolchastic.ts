#######################################################
#
# Hodorific Enterprises, inc. (c) 2009 - 2015
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
#######################################################

declare lower;
input KPeriod = 30;
input smoothingType = { default _SMA, _EMA, _EMA2, _WMA};

def priceH = high;
def priceL = low;
def priceC = close;


def over_bought = 80;
def over_sold = 20;
def slowing_period = if KPeriod < 18 then 3 else RoundDown( KPeriod * 0.6, 0);
def DPeriod = if KPeriod < 60 then 3 else RoundDown(KPeriod * 0.05, 0);

def c1 = priceC - Lowest(priceL, KPeriod);
def c2 = Highest(priceH, KPeriod) - Lowest(priceL, KPeriod);
def FastK = c1 / c2 * 100;

plot FullK;
plot FullD;
## Hide the trigger line to de-clutter the chart.
FullD.Hide();

switch ( smoothingType ){
    case _SMA:
        FullK = Average(FastK, slowing_period);
        FullD = Average(FullK, DPeriod); 
    case _EMA:
        FullK = ExpAverage(FastK, slowing_period);
        FullD = ExpAverage(FullK, DPeriod);
     case _EMA2:
        FullK = EMA2(FastK, slowing_period, 0.2);
        FullD = EMA2(FullK, DPeriod, 0.2);
    case _WMA:
        FullK = WMA(FastK, slowing_period);
        FullD = WMA(FullK, DPeriod);
}

plot OverBought = over_bought;
plot OverSold = over_sold;

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
else if ( FastK <= over_sold ) {
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

##def alert_trigger = { default off, bull_rev, bear_rev );
def direction = { default up_tick, down_tick };
if ( trend == trend.bull_rev && trend[1] != trend.bull_rev ) {
    ## fire alert and flip color
	##alert_trigger = alert_trigger.bull_rev;
    direction = direction.down_tick;
}
else if ( trend == trend.bear_rev && trend[1] != trend.bear_rev ) {
     ## fire alert and flip color
     ##alert_trigger = alert_trigger.bear_rev;
	 direction = direction.up_tick;
}
else if ( trend == trend.bull_rev ) { direction = direction.up_tick; }
else if ( trend == trend.bear_rev ) { direction = direction.down_tick; }
else if ( FullK > FullD ) { direction = direction.up_tick; }
else { direction = direction.down_tick;
}

##alert( alert_trigger == alert_trigger.bull, concat( GetSymbol(), " - Bull trend reversal", Alert.BAR, Sound.CHIMES );
##alert( alert_trigger == alert_trigger.bear_rev, concat( GetSymbol(), " - Bear trend reversal", Alert.BAR, Sound.CHIMES );
          
FullK.AssignValueColor(  if direction == direction.up_tick then Color.BLACK else Color.RED );
FullD.SetDefaultColor(GetColor(4));
FullK.SetLineWeight(2);
OverBought.SetDefaultColor(GetColor(1));
OverSold.SetDefaultColor(GetColor(1));