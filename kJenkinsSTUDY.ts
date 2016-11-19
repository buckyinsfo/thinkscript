#hint: <b>Jenkins Cycle Volume</b> \n This study indicates a possible trend reversal after the cummulative volume range specified by the user is reached.\n
#hint jenkins_range: The number of shares traded for a trend reversal.
#hint length: The number of trading days per year.
##################################################################################
##
##  This code is based on some of the cyclic and harmonic methodology theory developed 
##  by Michael S. Jenkins.  Ken Hodor modified the cyclic indicator based on trade volume 
##  for the SPY and implemented his approach in TradeStation.  This is an implementation 
##  of the approach Ken presented at the August 22, 2015 San Diego Investools Meeting.
##
##  Every 1.1 Billion shares of SPY traded represents a possible trend reversal.
##  (Ken switched to 950 million float or jenmins range. )
##
##  Original Implementation: Ken Hodor - TradeStation Easy Language
##  09/16/2015 Implemented by Tim Sayre - ThinkorSwim thinkScript
##
##   NO ACTUAL OR IMPLIED WARRANTIES OFFERED - USE AT YOUR OWN DISCRETION 
##################################################################################
declare lower;

input jenkins_range = 950000000;        ## Ken Hodor determined 950 million shares traded fit the data set. (12/18/2015)
input length = 252;                     ## Trading days per year.
input showApproxDaysRemainLabel = yes;  ## Shows/Hide Label with approximate number of bars until reversal.

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
def cur_dir =  CompoundValue( 1, cycle_dir[1], If( floor( vol_to_low / jenkins_range ) % 2 == 0, 1, -1 ) );

## If it is first bar then we need to calculate initial volume based on location of lowest low bar.  
## Otherwise we use the previous bars value for cumulative volume.
def hist_vol = CompoundValue( 1, cumulative_vol[1],  vol_to_low % jenkins_range );

## Check to see if we need to reverse direction or not.
if ( hist_vol + bar_vol > jenkins_range ) then {
    ## Account for cycle reversal.
    cumulative_vol = hist_vol + bar_vol - jenkins_range;
    cycle_dir = cur_dir * (-1);
    
    ## debug
    debug_label = no;
} else {
    cumulative_vol = hist_vol + bar_vol;
    cycle_dir = cur_dir;

    ## debug
    debug_label = no;
}

plot JenkinsVol =  If ( cycle_dir == 1, 0, 1 ) + cycle_dir * cumulative_vol / jenkins_range;
JenkinsVol.SetPaintingStrategy( PaintingStrategy.LINE_VS_POINTS );
JenkinsVol.SetLineWeight( 2 );   ## Range from 1 to 5 ThinkScript imposed.

## Display for approximate number of bars remaining in the cycle.
def remain = ( jenkins_range - cumulative_vol ) / avg_daily;
AddLabel( showApproxDaysRemainLabel, "Approx. Days Remaining: " + Round( remain, 2 ), Color.WHITE );

#### debug #### 
## Just change this out for other variables.   
AddChartBubble( debug_label, 1.0, AsText( cycle_dir, NumberFormat.TWO_DECIMAL_PLACES ), Color.WHITE );