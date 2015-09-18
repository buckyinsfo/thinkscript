declare lower;

input jenkins_range = 1100000000;
input aggregationPeriod = AggregationPeriod.DAY;

def bar_vol = GetValue( volume, 0 );

def length = 252;
def cycle_rev;
def cumulative_vol;
def add_label;
def bars_per_cycle;

## Only need these value at the first bar, but not sure how else to keep this tidy by 
## using the Compound Value function w/o doing it for every bar.  the variable shouldn't 
## be needed after so just copying the previoyus bar val into current bar value.
def avg_daily = ( fold i = 0 to length with vol_sum = 0 do vol_sum + GetValue( volume, i ) ) / length;
def lo_idx = GetMinValueOffset( low, length );
def vol_to_low = CompoundValue( 1, vol_to_low[1], fold j = 0 to length - lo_idx with vol = 0 do vol + GetValue( volume, j ) );
def cur_dir =  CompoundValue( 1, cycle_rev[1], If( floor( vol_to_low / jenkins_range ) % 2 == 0, 1, -1 ) );

## If first bar then calculate based on chart lowest low.  
## Otherwise use the previous bars value for cumulative volume.
def hist_vol = CompoundValue( 1, cumulative_vol[1],  vol_to_low % jenkins_range );

if ( hist_vol + bar_vol > jenkins_range ) then {
    ## Account for cycle reversal.
    cumulative_vol = hist_vol + bar_vol - jenkins_range;
    cycle_rev = cur_dir * (-1);
    bars_per_cycle = 0;
    
    ## debug
    add_label = no;
} else {
    cumulative_vol = hist_vol + bar_vol;
    cycle_rev = cur_dir;
    bars_per_cycle = CompoundValue( 1, bars_per_cycle[1], 0 ) + 1; 
    ## debug
    add_label = no;
}

plot VolumeDivided =  If (cycle_rev == 1, 0, 1) + cycle_rev * cumulative_vol / jenkins_range;
VolumeDivided.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);

#### debug ####    
##AddChartBubble( add_label, 1.0, AsText(cycle_rev, NumberFormat.TWO_DECIMAL_PLACES), Color.WHITE );
##AddChartBubble( label, 0.2, AsText(init_vol, NumberFormat.TWO_DECIMAL_PLACES), Color.BLUE, no );

##def temp_dir = floor( vol_to_low / jenkins_range ) % 2;
##AddLabel( yes, "Temp Dir - " + temp_dir, Color.PLUM);

def remain = ( jenkins_range - cumulative_vol ) / avg_daily;
AddLabel( yes, "Approx. Days Remaining - " + Round( remain, 2 ), Color.PLUM);

AddLabel( yes, "Volume to Low - " + vol_to_low, Color.PLUM);