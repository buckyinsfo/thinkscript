declare lower;

input jenkins_range = 1100000000;
input aggregationPeriod = AggregationPeriod.DAY;

def bar_vol = volume( "spy", aggregationPeriod );
def cycle_rev;
def cumulative_vol;
def add_label;

if IsNaN( cumulative_vol[1] )
then {
    ## Account initial state.
    cumulative_vol = bar_vol;
    cycle_rev = 1;
    
    ## debug
    add_label = no;
} else if ( cumulative_vol[1] + bar_vol > jenkins_range )
then {
    ## Account for cycle reversal.
    cumulative_vol = cumulative_vol[1] + bar_vol - jenkins_range;
    ##cycle_rev =  (-1) * cycle_rev[1];
    if IsNaN( cycle_rev[1] ) or cycle_rev[1] == 0.0
    then {
        cycle_rev = 1.0;
    }  else {
        cycle_rev = (-1.0) * cycle_rev[1];
        ##cycle_rev = 2;
    }
    
    ## debug
    add_label = yes;
} else {
    cumulative_vol = cumulative_vol[1] + bar_vol;
    cycle_rev = cycle_rev[1];
    
    ## debug
    add_label = no;
}

plot VolumeDivided =  If (cycle_rev == 1, 0, 1) + cycle_rev * cumulative_vol / jenkins_range;
##plot VolumeDivided =  cumulative_vol / jenkins_range;
VolumeDivided.SetPaintingStrategy(PaintingStrategy.TRIANGLES);

AddChartBubble( add_label, 1.0, AsText(cycle_rev, NumberFormat.TWO_DECIMAL_PLACES), Color.WHITE );


input length = 252;

def hi_bar = GetMaxValueOffset(high, length);
def lo_bar = GetMinValueOffset(low, length);
def hi_hi = HighestAll( high );
def lo_lo = LowestAll( low );

def off_set = Min( hi_bar, lo_bar );

## use more recent to anchor the jenkins cycle.
##if ( off_set == hi_bar ) then {
def vol_to_hi = fold i = 0 to off_set with vol = 0 do vol + GetValue( volume, i );


    
    
    



AddLabel( yes, "Lowest Offset: " + lo_bar + " Highest Offset: " + hi_bar, Color.PLUM);
AddLabel( yes, "Lowest: " + lo_lo + " Highest: " + hi_hi + "Volume - " + vol_to_hi, Color.PLUM);