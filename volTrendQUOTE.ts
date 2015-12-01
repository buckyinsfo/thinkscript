##################################################################################
#
#  
#
#  
#
##################################################################################
declare lower;

input start_time = 0930;
##def period = 1;
def yyyymmdd = getYyyyMmDd();                               ## Trading day date.  
##def secs_from_midnight = secondsFromTime(0);                ## Seconds from midnight.
##def secs_from_bell = secondsFromTime( start_time );
##def multiplier = 1;

def ap = getAggregationPeriod();
##assert(ap >= AggregationPeriod.HOUR, "Study can only be calculated for time-aggregated charts of an hour or less: " + ap);

def rth = (RegularTradingEnd( yyyymmdd ) - RegularTradingStart( yyyymmdd )) / AggregationPeriod.HOUR;
##def tradingBarsPerDay = (regularTradingEnd( yyyymmdd ) - regularTradingStart( yyyymmdd ) ) / ap;

def secSinceOpen = SecondsFromTime(start_time);
##def secSinceMidnight = SecondsFromTime(0);

def pastOpen = If( SecondsTillTime( start_time ) > 0, 0, 1 );
def pastClose = If( secSinceOpen < rth * 3600, 0, 1 ); 
def isRth = If( pastOpen and !pastClose, 1, 0 );

def barsToday = If( isRth, secSinceOpen * 1000 / ap, 0 );
def barsPerDay = 24 * 3600 * 1000 / ap;

def offset;
def volRatio;
if ( isRth ) then {
    offset = secSinceOpen * 1000 / ap;
	volRatio = ( fold i = 0 to offset with vol_sum_0 = 0 do vol_sum_0 + GetValue( volume, i ) ) /
               ( fold j = barsPerDay to barsPerDay + offset with vol_sum_1 = 0 do vol_sum_1 + GetValue( volume, j ) );
	
} else {
    offset = Double.NaN;
	volRatio = Double.NaN;
}

##@def val_0 =( fold i = 0 to 1 with vol_sum_0 = 0 do vol_sum_0 + GetValue( volume, i ) );
##def val_0 =( fold i = 0 to offset with vol_sum_1 = 0 do vol_sum_1 + GetValue( volume, i ) );
##def val_1 =  fold j = barsPerDay to barsPerDay + offset with vol_sum = 0 do vol_sum + GetValue( volume, j ) );
##def val_0 = GetValue( volume, barsPerDay );

##plot C = volume / GetValue( volume, barsToday, 0 );
plot C = volRatio;


##************************
## Debug
##************************
def show = yes;

AddLabel( show, "getYyyyMmDd(): " + getYyyyMmDd() );
AddLabel( show, "first(yyyymmdd): " + first(yyyymmdd) );
AddLabel( show, "RTH duration (hrs): " + rth );
AddLabel( show, "RTS - Trade start : " + RegularTradingStart( yyyymmdd ) ); 
AddLabel( show, "isRth: " + isRth );

AddLabel( show, "barsPerDay: " + barsPerDay );

AddLabel( show, "SinceOpen: " + secSinceOpen );
##AddLabel( show, "SinceMidnight: " + secSinceMidnight );
AddLabel( show, "past Open: " + pastOpen );
AddLabel( show, "past Close: " + pastClose );
AddLabel( show, "isRth: " + isRth );
AddLabel( show, "Bars per day): " + barsToday );

AddLabel( show, "ap: " + ap );
AddLabel( show, "volRatio: " + volRatio );
##AddLabel( show, "val_0: " + val_0 );
##AddLabel( show, "val_1: " + val_1 );
##AddLabel( show, "dom:" + dom );
##AddLabel( show, "dow:" + dow );
##AddLabel( show, "expthismonth:" + expthismonth );
##AddLabel( show, "exp_opt:" + exp_opt );