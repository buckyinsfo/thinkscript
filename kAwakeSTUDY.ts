##################################################################################
#
#  Hodorific Enterprises, inc. (c) 2015
#
#  This code is based on J. Welles Wilder's ADX indicator.  It is combined with an  
#  analysis of price pull back from the previous day to indicate strength of momentum.
#  It is designed to vary background colors to indicate "awake" or "asleep" state 
#  of the asset.
#
#  The coloring goes from Yellow to White "Hot" when price moves at such a rate 
#  that we see less than 50% pull backs --market movement is very strong.  
#
#  Yellow indicates a pullback of more than 50% of the previous bar
#  --not quite as strong. }
#
#  Original Author: Ken Hodor - TradeStation Easy Language
#  05/19/2015 converted by Tim Sayre - ThinkorSwim ThinkScript
#  05/21/2015 updated by Tim Sayre - Implemented alert section.
#
##################################################################################
declare lower;

input trigger_level = 20;     ## The level at which to trigger an alert.  
input length = 14;           ## Number of bars to be used in the ADX calculation.

                             ## Set to true if it is desired for ADX indicator to be
                             ## colored different colors, depending on whether it is 
                             ## above or below the triggerLevel;  
                             ## Set to false if it is not desired to use different colors
                             ## for the ADX line based on its relationship to the TriggerLevel.
## TODO - Create a separate plot with only one color and use the SetHiding flag to flip between the two.
##input usePlotColoring = {default TRUE, FALSE};


input showOverLap = {default TRUE, FALSE};
input showAdjustedADXPlot = {default TRUE, FALSE};
input showADXLabel = { default TRUE, FALSE };

def ADX = reference DMI(length, AverageType.WILDERS).ADX;

## Allow user input to show/hide the adjusted ADX plot.
plot adjusted_ADX = (ADX - trigger_level) / 100;
adjusted_ADX.AssignValueColor( if adjusted_ADX >= 0 then Color.UPTICK else Color.DOWNTICK );
adjusted_ADX.SetHiding( !showAdjustedADXPlot );

## Determine awake_factor based on comparing ADX to trigger level
def awake_factor;
if ( ADX > trigger_level ) then {        ## Above trigger line
    awake_factor = 0.5;
} else if (ADX == trigger_level) then {  ## At trigger line
    awake_factor = 0.0;
} else {                                 ## Below trigger line
    awake_factor = -0.5;
}

plot State = awake_factor;
State.DefineColor("Awake", Color.YELLOW);
State.DefineColor("Trigger", Color.CYAN);
State.DefineColor("Asleep", Color.RED);

## Override the color of the plot line for State plot based 
## on extreme inside move compared to previous bar.
def half_diff = (high - low) / 2;
def extreme_inside;
if  low >= low[1] and high > low then {
    extreme_inside = ( (high[1] - half_diff[1]) - (low[1] + half_diff) ) / (high - low) + (low - low[1]);
} else {
    extreme_inside = 0;  
}
State.AssignValueColor( if extreme_inside >= 1 then Color.WHITE else if State >= 0 then State.Color("Awake") else if State == 0 then State.Color("Trigger") else State.Color("Asleep"));
State.SetLineWeight( 3 );
AddCloud( awake_factor, -awake_factor, Color.YELLOW, Color.DARK_GRAY );

## Determine overlap plot
## Calculate if the current bar is inside the previous bar.
def over_lap;
if  low >= low[1] and high > low then {
    over_lap = (high[1] - low[1]) / (high - low) + (low - low[1]);
} else {
    over_lap = 0;  
}
plot OLP = over_lap;
OLP.AssignValueColor( if over_lap >= 1 then Color.WHITE else Color.BLACK );
OLP.SetHiding( !showOverLap );

## Add a label to the chart with ADX.
AddLabel(showADXLabel, concat( "ADX = ", ADX ));

## TODO
#if Value1 <> Value1[1] then
#{
#    Value2 = TL_New(Date, Time, High+1, Date, Time, Low);
#    TL_SetExtRight(Value2, True);
#    TL_SetExtLeft(Value2, True);
#    TL_SetColor(Value2, VerticalLineColor);  //The color 100 is a very dark red
#    Value2 = TL_SetStyle(Value2, 5);
#}

#######################################################
# Alert Section
#######################################################
alert( adjusted_ADX crosses above 0, concat( GetSymbol(), " - Market is awaking up."), Alert.BAR, Sound.CHIMES );
alert( adjusted_ADX crosses below 0, concat( GetSymbol(), " - Market is going to sleep."), Alert.BAR, Sound.CHIMES );
#######################################################