
def priceH = high;
def priceL = low;
def priceC = close;
def kPeriod = 13;
def slowing_period = 3;
def over_bought = 80;
def over_sold = 20;
input smoothingType = {default SMA, EMA};

def fullK = reference StochasticFull("k period" = kPeriod, "price h" = priceH, "price l" = priceL, "price c" = priceC, "slowing period" = slowing_period, "smoothing type" = smoothingType).FullK;

def fullD = reference StochasticFull("k period" = kPeriod, "price h" = priceH, "price l" = priceL, "price c" = priceC, "slowing period" = slowing_period, "smoothing type" = smoothingType).FullD;

def bLE = If(fullK crosses fullD && fullK >= over_sold, yes, no);
def bSE = If(fullD crosses fullK && fullK <= over_bought, yes, no);
##def bLE = If(fullK > fullD && fullK crosses above over_sold, yes, no);
##def bSE = If(fullD < fullK && fullK crosses below over_bought, yes, no);

def long_exit = no;
def short_exit = no;

def fan_width = 25;
def trade_price;
def offset;

def state = {default init, long, short};
switch (state[1]) {
case init:
    if bLE {
        state = state.long;
        trade_price = priceL;
        offset = BarNumber();
    } else if bSE {
        state = state.short;
        trade_price = priceH;
        offset = BarNumber();
    } else {
        state = state.init;
        trade_price = Double.NaN;
        offset = -1;
    }
case long:
    if !long_exit {
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
    if !short_exit {
        state = state.short;
        trade_price = trade_price[1];
        offset = offset[1] + 1;
    }
    else {
        state = state.init;
        trade_price = Double.NaN;
        offset = -1;
    }
}

def hihi = HighestAll(high);
def lolo = LowestAll(low);

def box_top = Sqrt( Sqrt( hihi ) ) * fan_width + trade_price;
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
##plot gann_3x1;
##plot gann_4x1;
##plot gann_8x1;
if  offset >= 0 && offset <= fan_width
then {
    val_1x8 = Sqrt( Sqrt( hihi ) ) * offset * 8 + trade_price;
    gann_1x8 = If(val_1x8 <= box_top, val_1x8, Double.NaN);
    val_1x4 = Sqrt( Sqrt( hihi ) ) * offset * 4 + trade_price;
    gann_1x4 = If(val_1x4 <= box_top, val_1x4, Double.NaN);
    val_1x3 = Sqrt( Sqrt( hihi ) ) * offset * 3 + trade_price;
    gann_1x3 = If(val_1x3 <= box_top, val_1x3, Double.NaN);
    val_1x2 = Sqrt( Sqrt( hihi ) ) * offset * 2 + trade_price;
    gann_1x2 = If(val_1x2 <= box_top, val_1x2, Double.NaN);

    gann_1x1 = Sqrt( Sqrt( hihi ) ) * offset + trade_price;
    gann_2x1 = Sqrt( Sqrt( hihi ) ) * offset * 0.5 + trade_price;
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
    ##gann_3x1 = Double.NaN;
    ##gann_4x1 = Double.NaN;
    ##gann_8x1 = Double.NaN;
}

gann_1x8.SetPaintingStrategy(PaintingStrategy.LINE);
gann_1x8.SetDefaultColor(Color.BLACK);
gann_1x8.SetLineWeight(2);
gann_1x4.SetPaintingStrategy(PaintingStrategy.LINE);
gann_1x4.SetDefaultColor(Color.BLACK);
gann_1x4.SetLineWeight(2);
gann_1x3.SetPaintingStrategy(PaintingStrategy.LINE);
gann_1x3.SetDefaultColor(Color.BLACK);
gann_1x3.SetLineWeight(2);
gann_1x2.SetPaintingStrategy(PaintingStrategy.LINE);
gann_1x2.SetDefaultColor(Color.BLACK);
gann_1x2.SetLineWeight(2);
gann_1x1.SetPaintingStrategy(PaintingStrategy.LINE);
gann_1x1.SetDefaultColor(Color.BLACK);
gann_1x1.SetLineWeight(2);
gann_2x1.SetPaintingStrategy(PaintingStrategy.LINE);
gann_2x1.SetDefaultColor(Color.BLACK);
gann_2x1.SetLineWeight(2);