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

FullK.AssignValueColor(  if FullK > FullD then Color.BLACK else Color.RED);
FullD.SetDefaultColor(GetColor(4));
FullK.SetLineWeight(2);
OverBought.SetDefaultColor(GetColor(1));
OverSold.SetDefaultColor(GetColor(1));