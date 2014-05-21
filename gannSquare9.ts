

script _kstochastic {

#######################################################
#
# Hodorific Enterprises, inc. (c) 2009
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
input KPeriod = 13;

def priceH = high;
def priceL = low;
def priceC = close;
def smoothingType = { default _SMA, _EMA, _EMA2, _WMA};


def over_bought = 80;
def over_sold = 20;
def slowing_period = if KPeriod < 18 then 3 else RoundDown( KPeriod * 0.6, 0);
def DPeriod = if KPeriod < 60 then 3 else RoundDown(KPeriod * 0.05, 0);

def c1 = priceC - Lowest(priceL, KPeriod);
def c2 = Highest(priceH, KPeriod) - Lowest(priceL, KPeriod);
def FastK = c1 / c2 * 100;

plot FullK;
plot FullD;
## Hide the trigger line to declutter the chart.
FullD.Hide();

switch ( smoothingType[1] ){
    case _SMA:
        smoothingType = smoothingType._SMA;
        FullK = Average(FastK, slowing_period);
        FullD = Average(FullK, DPeriod); 
    case _EMA:
        smoothingType = smoothingType._EMA;
        FullK = ExpAverage(FastK, slowing_period);
        FullD = ExpAverage(FullK, DPeriod);
     case _EMA2:
        smoothingType = smoothingType._EMA2;
        FullK = EMA2(FastK, slowing_period, 0.2);
        FullD = EMA2(FullK, DPeriod, 0.2);
    case _WMA:
        smoothingType = smoothingType._WMA;
        FullK = WMA(FastK, slowing_period);
        FullD = WMA(FullK, DPeriod);
}

plot OverBought = over_bought;
plot OverSold = over_sold;
};


###################################
## Gann angles - square 9
###################################
input show_lines = { default "show 3", "show 5", "show 9" };
input entries = { default "long", "short", "both" };
def priceH = high;
def priceL = low;
def priceC = close;

def _over_bought = reference _kstochastic(13).OverBought;
def _over_sold = reference _kstochastic(13).OverSold;

def _fullK = reference _kstochastic(13).FullK;
def _fullD = reference _kstochastic(13).FullD;

def long_entry = If( (_fullK > _fullD) && (_fullK crosses above _over_sold), yes, no);
def short_entry = If( (_fullK < _fullD) && (_fullK crosses below _over_bought), yes, no);

def fan_width = 34;
def trade_price;
def offset;
def state = {default init, long, short};
def long_exit = If ( state[1] == state.long && short_entry, yes, no);
def short_exit = If (  state[1] == state.short && long_entry, yes, no);;

switch (state[1]) {
case init:
    if long_entry then {
        state = state.long;
        trade_price = priceL;
        offset = 0;
    } else if short_entry then {
        state = state.short;
        trade_price = priceH;
        offset = 0;
    } else {
        state = state.init;
        trade_price = Double.NaN;
        offset = -1;
    }
case long:
    if !short_entry then {
        state = state.long;
        trade_price = trade_price[1];
        offset = offset[1] + 1;
    }
    else {
        state = state.init;
        trade_price = Double.NaN;
        offset = -1;
    }
case short:
    if !long_entry {
        ##state = state.short;
        ##trade_price = trade_price[1];
        ##offset = offset[1] + 1;
        state = state.init;
        trade_price = Double.NaN;
        offset = -1;
    }
    else {
        state = state.init;
        trade_price = Double.NaN;
        offset = -1;
    }
}

AddLabel( yes, "offset = " + offset[1] );
AddLabel( yes, "long_entry = " + long_entry[1] );
AddLabel( yes, "short_entry = " + short_entry[1] );
AddLabel( yes, "trade price = " + trade_price[1] );
AddChartBubble( long_entry, trade_price, "LE",  Color.BLUE, no );
AddChartBubble( long_exit, trade_price, "LX", Color.RED, no );

def hihi = HighestAll(high);
def lolo = LowestAll(low);
##def normalize = Sqrt( Sqrt( hihi ) );

def ATRLength = 13;
def normalize = AvgTrueRange(high, close, low, ATRLength);

def box_top = normalize * fan_width + trade_price;
def val_1x8;
def val_1x4;
def val_1x3;
def val_1x2;
plot gann_1x8;
plot gann_1x4;
plot gann_1x3;
plot gann_1x2;
plot gann_1x1;
plot gann_2x1;
plot gann_3x1;
plot gann_4x1;
plot gann_8x1;
if  offset >= 0 && offset <= fan_width
then {
    val_1x8 = normalize * offset * 8 + trade_price;
    gann_1x8 = If(val_1x8 <= box_top, val_1x8, Double.NaN);
    val_1x4 = normalize * offset * 4 + trade_price;
    gann_1x4 = If(val_1x4 <= box_top, val_1x4, Double.NaN);
    val_1x3 = normalize * offset * 3 + trade_price;
    gann_1x3 = If(val_1x3 <= box_top, val_1x3, Double.NaN);
    val_1x2 = normalize * offset * 2 + trade_price;
    gann_1x2 = If(val_1x2 <= box_top, val_1x2, Double.NaN);

    gann_1x1 = normalize * offset + trade_price;
    gann_2x1 = normalize * offset * 0.5 + trade_price;
    gann_3x1 = normalize * offset * 0.333 + trade_price;
    gann_4x1 = normalize * offset * 0.250 + trade_price;
    gann_8x1 = normalize * offset * 0.125 + trade_price;
} else {
    val_1x8 = Double.NaN;
    val_1x4 = Double.NaN;
    val_1x3 = Double.NaN;
    val_1x2 = Double.NaN;
    gann_1x8 = Double.NaN;
    gann_1x4 = Double.NaN;
    gann_1x3 = Double.NaN;
    gann_1x2 = Double.NaN;
    gann_1x1 = Double.NaN;
    gann_2x1 = Double.NaN;
    gann_3x1 = Double.NaN;
    gann_4x1 = Double.NaN;
    gann_8x1 = Double.NaN;
}

def plot_type = PaintingStrategy.LINE;
def line_weight = 2;
gann_1x8.SetPaintingStrategy(plot_type);
gann_1x8.SetDefaultColor(Color.BLACK);
gann_1x8.SetLineWeight(line_weight);
gann_1x4.SetPaintingStrategy(plot_type);
gann_1x4.SetDefaultColor(Color.BLACK);
gann_1x4.SetLineWeight(line_weight);
gann_1x3.SetPaintingStrategy(plot_type);
gann_1x3.SetDefaultColor(Color.BLACK);
gann_1x3.SetLineWeight(line_weight);
gann_1x2.SetPaintingStrategy(plot_type);
gann_1x2.SetDefaultColor(Color.BLACK);
gann_1x2.SetLineWeight(line_weight);
gann_1x1.SetPaintingStrategy(plot_type);
gann_1x1.SetDefaultColor(Color.BLACK);
gann_1x1.SetLineWeight(line_weight);
gann_2x1.SetPaintingStrategy(plot_type);
gann_2x1.SetDefaultColor(Color.BLACK);
gann_2x1.SetLineWeight(line_weight);
gann_3x1.SetPaintingStrategy(plot_type);
gann_3x1.SetDefaultColor(Color.BLACK);
gann_3x1.SetLineWeight(line_weight);
gann_4x1.SetPaintingStrategy(plot_type);
gann_4x1.SetDefaultColor(Color.BLACK);
gann_4x1.SetLineWeight(line_weight);
gann_8x1.SetPaintingStrategy(plot_type);
gann_8x1.SetDefaultColor(Color.BLACK);
gann_8x1.SetLineWeight(line_weight);