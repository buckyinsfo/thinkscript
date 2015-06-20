##################################################################################
#
#  Hodorific Enterprises, inc. (c) 2015
#
#  This code is based on J. Welles Wilder's ADX indicator.  It is combined with an  
#  analysis of price pull back from the previous day to indicate strength of trend.
#  It is designed to vary background colors to indicate "awake" or "asleep" state 
#  of the asset.  Yellow -> Sunny/Awake & Dark Gray -> Night/Asleep
#
#  The coloring goes from Yellow to White "Hot" when price moves at such a rate 
#  that we see less than 50% pull backs --market trend is very strong.  
#
#  Yellow indicates a pullback of more than 50% of the previous bar
#  --not quite as strong.  ( In thinkScript trigger is a double and the comparision 
#  of ADX to the trigger is unlikely. Perhaps ADX is rounded by tradeStation in the
#  original implementation. )
#
#  Original Author: Ken Hodor - TradeStation Easy Language
#  05/28/2015 converted by Tim Sayre - ThinkorSwim ThinkScript
#  06/12/2015 updated by Tim Sayre - Testing and minor syntax changes.
#  06/14/2015 branch by Tim Sayre - kAwake_orig_imp.
#  06/18/2015 new dev. on master by Tim Sayre - adjusted ADX plot and overlap as bubbles.
#
##################################################################################
declare lower;

input trigger_level = 20;    ## The ADX level at which to trigger an alert.  
input length = 14;           ## Number of bars to be used in the ADX calculation.

                             ## Set to true if it is desired for ADX indicator to be
                             ## colored different colors, depending on whether it is 
                             ## above or below the triggerLevel;  
                             ## Set to false if it is not desired to use different colors
                             ## for the ADX line based on its relationship to the TriggerLevel.

                             ## TODO - Create a separate plot with only one color and use the SetHiding flag to flip between the two.
##input usePlotColoring = {default true, false};

input showOverLap = {default true, false};
input showAdjustedADXPlot = { true, default false};
input showADXLabel = { default true, false };
input overlap_threshold= 1.0; ## used to trigger overlap bubbles based on the overlap_threshold >= gap up/down 
                              ## of a bar compared to previous bar.  May want to change this to show 2.0 or 
                              ## 3.0 times previous bar length. 

## Check if bar location is in expansion area.
def onExpansion = if isNaN( close ) then yes else no;

def ADX = reference DMI(length, AverageType.WILDERS).ADX;

## Determine awake_factor based on comparing ADX to trigger level
def awake_factor;
if ( onExpansion ) then {
    awake_factor = Double.NaN;
} else if ( ADX >= trigger_level + 1 ) then {       ## Above trigger line
    awake_factor = 0.5;
} else if (ADX < trigger_level + 1) and
          (ADX > trigger_level)  then {             ## At trigger line
    awake_factor = 0.0;
} else {                                            ## Below trigger line
    awake_factor = -0.5;
}

plot State = awake_factor;
## Allow user input to show/hide the adjusted ADX plot.
plot adjusted_ADX = (ADX - trigger_level) / 100;
adjusted_ADX.AssignValueColor( if adjusted_ADX >= 0 then Color.UPTICK else Color.DOWNTICK );
adjusted_ADX.SetHiding( showAdjustedADXPlot );

## These color are for the line plot, not the background
State.DefineColor("Awake", Color.YELLOW);
State.DefineColor("Trigger", Color.CYAN);
State.DefineColor("Asleep", Color.RED);

## Background coloring ( YELLOW -> Sunny/Awake & Dark_Gray -> Night/Asleep
AddCloud( awake_factor, -awake_factor, Color.YELLOW, Color.DARK_GRAY );

#### Enhancement 1 to ADX study.
## Override the color of the plot line for State plot based 
## on extreme inside move compared to previous bar.
def half_diff = (high - low) / 2;
def extreme_inside;
if  low >= low[1] and high > low then {
    extreme_inside =  if ( high < high[1] - half_diff[1] ) or ( low > half_diff[1] + low[1] ) then yes else no;
} else {
    extreme_inside = no;  
}

## Enhancement 2 to ADX study.
## Determine overlap plot
## Calculate if the current bar is inside the previous bar.
def over_lap;
def gap_up;
if low > low[1] then {
    over_lap = (low - low[1]) / ( high[1] - low[1]);
    gap_up = yes;
} else if high < high[1] then {
    over_lap = (high[1] - high) / (high[1] - low[1]);
    gap_up = no;
} else {
    over_lap = Double.NaN;
    gap_up = Double.NaN;
}

def enhanced_condition = if extreme_inside or over_lap >= overlap_threshold then yes else no;
State.AssignValueColor( if enhanced_condition  then Color.WHITE else if State > 0 then State.Color("Awake") else if State == 0 then State.Color("Trigger") else State.Color("Asleep"));
State.SetLineWeight( 5 );   ## Range from 1 to 5 ThinkScript imposed.

## Plot over_lap value as a down arrow.
## Ignore over_lap for asleep state.
##plot OLP = over_lap - 0.5;    
##OLP.AssignValueColor( if over_lap >= 1 then Color.WHITE else Color.BLACK );
##OLP.SetPaintingStrategy( PaintingStrategy.LINE );
##OLP.SetHiding( showOverLap );
AddChartBubble( if over_lap >= overlap_threshold then yes else no, 0.5, Round( over_lap, 2 ) + "x", Color.WHITE );
AddVerticalLine( if over_lap >= overlap_threshold then yes else no, if gap_up then "Move Up" else "Move Down", Color.WHITE, Curve.SHORT_DASH );
 
## Debug bubbles
## used to trigger overlap bubbles based on the overlap_threshold >= gap up/down of a bar compared to previous bar.  
## May want to change this to show 2.0 or 3.0 times previous bar length. 
##AddChartBubble( if over_lap >= overlap_threshold then yes else no, over_lap, over_lap + " on high of " + high + " and h[1] of " + high[1]);
##AddChartBubble( if over_lap >= overlap_threshold then yes else no, over_lap, over_lap + " on low of " + low );

## Add a label to the chart with ADX.
AddLabel( !showADXLabel, concat( "ADX = ", ADX ));

#######################################################
# Alert Section
#######################################################
alert( adjusted_ADX crosses above 0, concat( GetSymbol(), " - Market is awaking up."), Alert.BAR, Sound.CHIMES );
alert( adjusted_ADX crosses below 0, concat( GetSymbol(), " - Market is going to sleep."), Alert.BAR, Sound.CHIMES );
#######################################################