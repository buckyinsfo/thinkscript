#
# Hodorific Enterprises, inc. (c) 2009
#
# This Stochastic tries to simplify the user interface by
# only requiring one number. The other numbers are scaled off
# this one number.
#
# Also this routine simplifies the graphics to show either a
# green or red line.  When the line changes from Red to Green
# under OverSold line that is your buy signal. When it turns
# from a Green to a Red above the OverBought line that is your
# sell signal.

declare lower;
declare all_for_one;

input KPeriod = 30;

def priceH = high;
def priceL = low;
def priceC = close;
def smoothingType = 1;

def over_bought = 80;
def over_sold = 20;
def slowing_period = if KPeriod < 18 then 3 else rounddown( KPeriod * 0.6,0);
def DPeriod = if Kperiod < 60 then 3 else roundDown(KPeriod * 0.05,0);

def c1 = priceC - Lowest(priceL, KPeriod);
def c2 = Highest(priceH, KPeriod) - Lowest(priceL, KPeriod);
def FastK = c1 / c2 * 100;

plot FullK;
plot FullD;
FullD.hide();

switch  smoothingType ==
then {
    FullK = Average(FastK, slowing_period);
    FullD = Average(FullK, DPeriod);
} else {
    FullK = ExpAverage(FastK, slowing_period);
    FullD = ExpAverage(FullK, DPeriod);
}

plot OverBought = over_bought;
plot OverSold = over_sold;

FullK.AssignValueColor(if FullK > FullD then Color.UPTICK else Color.DOWNTICK);
FullD.SetDefaultColor(GetColor(4));
FullK.SetLineWeight(2);
OverBought.SetDefaultColor(GetColor(1));
OverSold.SetDefaultColor(GetColor(1));