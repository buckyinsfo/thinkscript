##def tradeStart = getDay();
##plot X = if tradeStart <= 55 then 1625 else Double.NaN;

script _gannFan {
    input fan_width = 25;

    ## Highest High and Lowest Low for the chart.        
    def hh = HighestAll(high);
    def ll = LowestAll(low);

    # Time Values (Mllliseconds)
    #def slope = ATan(Double.pi/4);
    #def aggTime = GetAggregationPeriod();
    #def aggPrice = if IsNaN( aggPrice[1] ) then HIGH - LOW else Double.NaN;
    #def normPrice = aggPrice / aggTime;
    
    def entryTime = 20;    # Get from kStochastic Strategy
    def entryPrice = 1800;  # Get from kStochastic Strategy
    def bEntry = !IsNan( entryTime ) && !IsNan( entryPrice );
    
## remove temp flag once hook into order strategy
    def bTempFlag = if GetDay() <= entryTime then 1 else 0;         
    
    rec offset = if ( bEntry ) then offset[1] + 1 else 0; 
    ## time units to plot since order open
    ## opposite = adjacent * atan( Double.Pi/4 )
    plot gann_1x1;
    if  offset < fan_width  then {
        ##gann_1x1 = offset + entryPrice;
        ##gann_1x1 = 1800;
        gann_1x1 = Sqrt( Sqrt( hh ) ) * offset + entryPrice;
##// Some Comment
    } else {
        gann_1x1 = Double.NaN;
    }
}

plot X = _gannFan( 10 );
    ##AddLabel(yes, "offset: " + _gannFan.offset);
    ##AddLabel(yes, "bTempFlag: " + _gannFan.bTempFlag);
    ##AddLabel(yes, "bEntry: " + _gannFann.bEntry);

##X.SetPaintingStrategy(PaintingStrategy.Points);
##X.SetDefaultColor(Color.CYAN);
##X.HideBubble();
##X.SetLineWeight(5);