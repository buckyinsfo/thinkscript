#hint: <b>Jenkins Cycle Volume</b> \n This study draws a trendline on tbe upper chart based on the logic from kJenkinsSTUDY.ts
#hint jenkins_range: The number of shares traded for a trend reversal.
#hint length: The number of trading days per year.
##################################################################################
##
##  This code is a companion script to kJenkinsSTUDY.ts.  This cdodee draws a trend 
##  line on the upper price chart based on the logic described in kJenkinsSTUDY.ts.
##  Please reference the header in thgat script for a description of the logic.

##  Original Implementation: Ken Hodor - TradeStation Easy Language
##  12/18/2015 Implemented by Tim Sayre - ThinkorSwim thinkScript
##
##   NO ACTUAL OR IMPLIED WARRANTIES OFFERED - USE AT YOUR OWN DISCRETION 
##################################################################################
declare upper;

input jenkins_range = 950000000;        ## Ken Hodor determined 950 million shares traded fit the data set. (12/18/2015)
input length = 252;                     ## Trading days per year.

def cycle_dir;
def cumulative_vol;
def debug_label;

def bar_vol = GetValue( volume, 0 );

## Only need these values at the first bar, but not sure how else to keep this tidy except by 
## using the Compound Value function w/o this preventing the calculation for every bar.  
## The variable isn't needed afterwards so just copying the previous bar value into the current bar value.
def avg_daily = ( fold i = 0 to length with vol_sum = 0 do vol_sum + GetValue( volume, i ) ) / length;
def lo_idx = GetMinValueOffset( low, length );
def vol_to_low = CompoundValue( 1, vol_to_low[1], fold j = 0 to length - lo_idx with vol = 0 do vol + GetValue( volume, j ) );

## Checks to see if odd or even number to determine initial direction.
def cur_dir =  CompoundValue( 1, cycle_dir[1], If( Floor( vol_to_low / jenkins_range ) % 2 == 0, 1, -1 ) );

## If it is first bar then we need to calculate initial volume based on location of lowest low bar.  
## Otherwise we use the previous bars value for cumulative volume.
def hist_vol = CompoundValue( 1, cumulative_vol[1],  vol_to_low % jenkins_range );

## Check to see if we need to reverse direction or not.
def peak_val;
def peak_high;
def peak_low;
if ( hist_vol + bar_vol > jenkins_range ) then {
    ## Account for cycle reversal.
    cumulative_vol = hist_vol + bar_vol - jenkins_range;
    cycle_dir = cur_dir * (-1);
    
    ## Optimized plot to display line to make it closest to horizontal.
    ## This methodology is intended to mimic Ken Hodor's TradeStation EasyLanguage implimentation.

    ##draw a line from previous Jenkins max limit to current Jenkins max limit.
    if cycle_dir > 0 or BarNumber() == 1 then {
        peak_val = Double.NaN;
    } else if ( low <= peak_high[1] && low >= peak_low[1] ) then {
        peak_val = low;            ## try to make it horizontal.
    } else if ( peak_low[1] <= high && peak_low[1] >= low ) then {
        peak_val = peak_low[1];    ## try to make it horizontal.
    } else if ( high <= peak_high[1] && high >= peak_low[1]) then {
        peak_val = high;           ## try to make it horizontal.
    } else if ( peak_high[1] <= high && peak_high[1] >= low ) then {
        peak_val = peak_high[1];   ## try to make it horizontal.
    } else {                      
        peak_val = ( high + low ) / 2;
    }
    peak_high = high;
    peak_low = low;
    
    ## debug
    debug_label = no;
} else {
    ## Not a peak so just pull previous values forward until we need them for a peak.
    cumulative_vol = hist_vol + bar_vol;
    cycle_dir = cur_dir;

    peak_val = Double.NaN;
    peak_high = peak_high[1];
    peak_low = peak_low[1];
    
    ## debug
    debug_label = no;
}

plot line_JenkinsPeak = peak_val;
line_JenkinsPeak.enableApproximation();
line_JenkinsPeak.SetPaintingStrategy( PaintingStrategy.LINE );
line_JenkinsPeak.SetLineWeight( 1 );   ## Range from 1 to 5 ThinkScript imposed.
line_JenkinsPeak.SetDefaultColor( Color.YELLOW );

plot dot_JenkinsPeak = peak_val;
dot_JenkinsPeak.SetPaintingStrategy( PaintingStrategy.POINTS );
dot_JenkinsPeak.SetLineWeight( 3 );   ## Range from 1 to 5 ThinkScript imposed.
dot_JenkinsPeak.SetDefaultColor( Color.YELLOW );

AddVerticalLine( if !isNaN( peak_val ) then yes else no, "", Color.WHITE, Curve.SHORT_DASH );

#### debug #### 
## Just change this out for other variables.   
    AddChartBubble( debug_label, 1.0, AsText( cycle_dir, NumberFormat.TWO_DECIMAL_PLACES ), Color.WHITE );
    AddChartBubble( if debug_label && !isNaN( peak_val ) then yes else no, close, peak_val, Color.WHITE );
