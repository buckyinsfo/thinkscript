#############################################################
#
# Reversal Candles
#
#  Which way? Use whatever indicator you want to figure out
#  if the market is oversold or overbought
#
#  Ken Hodor
#    created:   1/16/2018
#
#############################################################
input upSlope = 0.1;
input downSlope = -0.4;
input turnDownBars = 8;
input turnUpBars = 3;
input ocSpread = 0.2;

def myATR = ATR(length = 5, averageType = AverageType.SIMPLE);
def barAvg = (open + close + high + low) / 4;

# overbought analysis
def lrsOverBought = 6 * ( WMA(barAvg, turnDownBars) -  Average(barAvg, turnDownBars) ) / (turnDownBars - 1);
def overbought =  ( (lrsOverBought > upSlope)
                and (open > close[1])
                and (open > close) 
                and ( AbsValue(open - close) > ocSpread) )
                or  ( low[1] - myATR > low );

# oversold analysis 
def lrsOverSold = 6 * ( WMA(barAvg, turnUpBars) -  Average(barAvg, turnUpBars) ) / (turnUpBars - 1);
def oversold = ( (lrsOverSold < downSlope)
                and (open < close[1]) 
                and (open < close)
                and ( AbsValue(open - close) < ocSpread) )
                or  ( (high - close) * 3 < (close - low) );

 
plot indicator1 = if overbought then high + myATR/2 else Double.NaN;
indicator1.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
indicator1.SetDefaultColor(Color.GREEN);
indicator1.SetLineWeight(2);

plot indicator2 = if oversold then low - myATR/2 else Double.NaN;
indicator2.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
indicator2.SetDefaultColor(Color.RED);
indicator2.SetLineWeight(2);