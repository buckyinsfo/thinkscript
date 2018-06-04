########################################################################################
## 
##  Volume Buzz from Worden TC2000 website.
##  A stock's volume for the current day (let's say at 11:32am) is compared 
##  to its average historical volume for the same percentage of the day.
##
##  The volume buzz tells you how far ahead or behind the stock is based on 
##  its normal historical activity. 
##  
##  A volume buzz of +250% means the stock is trading 250% more than normal for this portion of the day.
##
##  A figure of -50% means the stock is trading at only half of its norm for this portion of the day. 
## 
##  A figure of 0 means nothing unusual is going on in either direction. 
##
#########################################################################################
declare lower;

## Check to see if this is a daily or smaller aggregation period.
def isInterday = If( GetAggregationPeriod() <= AggregationPeriod.DAY, yes, no );
AddLabel( !isInterday, "The RVOL study must be viewed on an interday chart with no less than 15 minute bars.", Color.RED );

input trigger = 200; 
input startTime = 0830; 
input endTime = 1600; 
input activeHours = 7.5;
input display = yes;
input detail = yes;

def barsPerSession = activeHours * 3600 * 1000 / GetAggregationPeriod();
 
def active;
if ( SecondsFromTime(startTime) >= 0 && SecondsTillTime(endTime) > 0 ) then {
    active = CompoundValue( 1, active[1] + 1, 0);
} else {
    active = 0;
}

def days;
def startBar;
if ( active == 1 ) {
    days = CompoundValue(1, days[1] + 1, 0 );
    startBar = BarNumber();
} else {
    days = CompoundValue(1, days[1], 0 );
    startBar = CompoundValue( 1, startBar[1], 0 );
}

## Accumulate the volume for each individual day.
def volInst;
def delta;
if ( active == 1 ) then {
    volInst = 0;
    delta = startBar - startBar[1];
} else if ( active > 1 ) {
    volInst = volInst[1] + volume;
    delta = delta[1];
} else {
    volInst = 0;
    delta = delta[1];
}

def isToday = if GetLastDay() == GetDay() then 1 else 0;

def volSum;
if ( isToday && active > 0 ) then {
    volSum = GetValue( volSum, delta );
} else if ( days > 1 && active > 0 ) then {
    volSum = GetValue( volSum, delta ) + volInst;
} else {
    volSum = 0;
}

def volBuzz;
if ( active > 0 && days > 1 ) then {
    volBuzz = Round( 100 * volInst / ( volSum / days ), 0 );
} else {
    volBuzz = Double.NaN;
}

plot vb = if isToday && volBuzz >= trigger then 1 else Double.NaN;