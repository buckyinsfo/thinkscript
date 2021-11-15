#############################
## tjs impl of phoenix finder
## 

## inputs
input symbol_0 = "SPY";
input symbol_1 = "QQQ";
input symbol_2 = "IWM";
input symbol_3 = "DIA";
input symbol_4 = "TLT";
input symbol_5 = "AGG";
input symbol_6 = "GLD";
input symbol_7 = "SLV";
input symbol_8 = "UNG";
input symbol_9 = "USO";
input symbol_10 = "EEM";
input symbol_11 = "FXI";
input symbol_12 = "XLE";
input symbol_13 = "XLF";
input symbol_14 = "XLK";

input show_labels = yes;
input dash_size = 1;
input square_size = 2;

script calc_trend {
    input symbol = "";
    input crossingType = {default above, below};

    def Length1 = 5; 
    def Length2 = 8; 
    def Length3 = 13; 
    def Length4 = 21; 
    def Length5 = 34;

    def ema1 = expAverage(close(symbol), Length1); 
    def ema2 = expAverage(close(symbol), Length2); 
    def ema3 = expAverage(close(symbol), Length3); 
    def ema4 = expAverage(close(symbol), Length4);

    def u1 = ema1 > ema2; 
    def u2 = ema2 > ema3; 
    def u3 = ema3 > ema4;

    def d1 = ema1 < ema2; 
    def d2 = ema2 < ema3; 
    def d3 = ema3 < ema4;

    plot trendStrength = if Crosses( ema2, ema4, crossingType == CrossingType.above ) then 100
                         else if Crosses( ema2, ema4, crossingType == CrossingType.below ) then -100
                         else if (u1 and u2 and u3) then 2 
                         else if (u1 and u2 and !u3) then 1 
                         else if (d1 and d2 and d3) then -2 
                         else if (d1 and d2 and !d3) then -1 
                         else 0;
}

## ------ main ----- ##
declare lower;

## Bubble offsets
def major = 5;
def minor = 1;

##### Row 0 #####
def ts0 = calc_trend( symbol_0 );

plot row0_TRI = If( ts0 == 100 or ts0 == -100, 15, Double.NaN );
plot row0_SQ = If( ts0 == 2 or ts0 == -2, 15, Double.NaN );
plot row0_DASH = If( ts0 == 1 or ts0 == 0 or ts0 == -1, 15, Double.NaN );

row0_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row0_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row0_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row0_TRI.SetLineWeight( square_size );
row0_SQ.SetLineWeight( square_size );
row0_DASH.SetLineWeight( dash_size );

row0_TRI.AssignValueColor( if ts0 == 100 then Color.Green else if ts0 == -100 then Color.RED else Color.WHITE);
row0_SQ.AssignValueColor( if ts0 == 2 then Color.GREEN else if ts0 == -2 then Color.RED else Color.WHITE );
row0_DASH.AssignValueColor( if ts0 > 0 then Color.DARK_GREEN else if ts0 < 0 then Color.DARK_RED else Color.WHITE );

row0_TRI.HideTitle();
row0_SQ.HideTitle();
row0_DASH.HideTitle();

row0_TRI.HideBubble();
row0_SQ.HideBubble();
row0_DASH.HideBubble();

def last_data_bar_row0 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row0 = last_data_bar_row0 + minor;

AddChartBubble( barNumber() == bubble_loc_row0, 15, symbol_0 + ": " + ts0[minor], if ts0[minor] == 2 then Color.GREEN else if ts0[minor] == 1 then Color.DARK_GREEN else if ts0[minor] == -2 then Color.RED else if ts0[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_0 + ": " + ts0, if ts0 == 2 then Color.GREEN else if ts0 == 1 then Color.DARK_GREEN else if ts0 == -2 then Color.RED else if ts0 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 1 #####
def ts1 = calc_trend( symbol_1 );

plot row1_TRI = If( ts1 == 100 or ts1 == -100, 14, Double.NaN );
plot row1_SQ = If( ts1 == 2 or ts1 == -2, 14, Double.NaN );
plot row1_DASH = If( ts1 == 1 or ts1 == 0 or ts1 == -1, 14, Double.NaN );

row1_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row1_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row1_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row1_TRI.SetLineWeight( square_size );
row1_SQ.SetLineWeight( square_size );
row1_DASH.SetLineWeight( dash_size );

row1_TRI.AssignValueColor( if ts1 == 100 then Color.Green else if ts1 == -100 then Color.RED else Color.WHITE);
row1_SQ.AssignValueColor( if ts1 == 2 then Color.GREEN else if ts1 == -2 then Color.RED else Color.WHITE );
row1_DASH.AssignValueColor( if ts1 > 0 then Color.DARK_GREEN else if ts1 < 0 then Color.DARK_RED else Color.YELLOW );

row1_TRI.HideTitle();
row1_SQ.HideTitle();
row1_DASH.HideTitle();

row1_TRI.HideBubble();
row1_SQ.HideBubble();
row1_DASH.HideBubble();

def last_data_bar_row1 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row1 = last_data_bar_row1 + major;

AddChartBubble( barNumber() == bubble_loc_row1, 14, symbol_1 + ": " + ts1[major], if ts1[major] == 2 then Color.GREEN else if ts1[major] == 1 then Color.DARK_GREEN else if ts1[major] == -2 then Color.RED else if ts1[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_1 + ": " + ts1, if ts1 == 2 then Color.GREEN else if ts1 == 1 then Color.DARK_GREEN else if ts1 == -2 then Color.RED else if ts1 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 2 #####
def ts2 = calc_trend( symbol_2 );

plot row2_TRI = If( ts2 == 100 or ts2 == -100, 13, Double.NaN );
plot row2_SQ = If( ts2 == 2 or ts2 == -2, 13, Double.NaN );
plot row2_DASH = If( ts2 == 1 or ts2 == 0 or ts2 == -1, 13, Double.NaN );

row2_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row2_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row2_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );
row2_TRI.SetLineWeight( square_size );
row2_SQ.SetLineWeight( square_size );
row2_DASH.SetLineWeight( dash_size );
row2_TRI.AssignValueColor( if ts2 == 200 then Color.Green else if ts2 == -100 then Color.RED else Color.WHITE);
row2_SQ.AssignValueColor( if ts2 == 2 then Color.GREEN else if ts2 == -2 then Color.RED else Color.WHITE );
row2_DASH.AssignValueColor( if ts2 > 0 then Color.DARK_GREEN else if ts2 < 0 then Color.DARK_RED else Color.WHITE );

row2_TRI.HideTitle();
row2_SQ.HideTitle();
row2_DASH.HideTitle();

row2_TRI.HideBubble();
row2_SQ.HideBubble();
row2_DASH.HideBubble();

def last_data_bar_row2 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row2 = last_data_bar_row2 + minor;

AddChartBubble( barNumber() == bubble_loc_row2, 13, symbol_2  + ": " + ts2[minor], if ts2[minor] == 2 then Color.GREEN else if ts2[minor] == 1 then Color.DARK_GREEN else if ts2[minor] == -2 then Color.RED else if ts2[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_2 + ": " + ts2, if ts2 == 2 then Color.GREEN else if ts2 == 1 then Color.DARK_GREEN else if ts2 == -2 then Color.RED else if ts2 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 3 #####
def ts3 = calc_trend( symbol_3 );

plot row3_TRI = If( ts3 == 100 or ts3 == -100, 12, Double.NaN );
plot row3_SQ = If( ts3 == 2 or ts3 == -2, 12, Double.NaN );
plot row3_DASH = If( ts3 == 1 or ts3 == 0 or ts3 == -1, 12, Double.NaN );

row3_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row3_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row3_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row3_TRI.SetLineWeight( square_size );
row3_SQ.SetLineWeight( square_size );
row3_DASH.SetLineWeight( dash_size );

row3_TRI.AssignValueColor( if ts3 == 100 then Color.Green else if ts3 == -100 then Color.RED else Color.WHITE);
row3_SQ.AssignValueColor( if ts3 == 2 then Color.GREEN else if ts3 == -2 then Color.RED else Color.WHITE );
row3_DASH.AssignValueColor( if ts3 > 0 then Color.DARK_GREEN else if ts3 < 0 then Color.DARK_RED else Color.WHITE );

row3_TRI.HideTitle();
row3_SQ.HideTitle(); 
row3_DASH.HideTitle();

row3_TRI.HideBubble();
row3_SQ.HideBubble();
row3_DASH.HideBubble();

def last_data_bar_row3 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row3 = last_data_bar_row3 + major;

AddChartBubble( barNumber() == bubble_loc_row3, 12, symbol_3 + ": " + ts3[major], if ts3[major] == 2 then Color.GREEN else if ts3[major] == 1 then Color.DARK_GREEN else if ts3[major] == -2 then Color.RED else if ts3[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_3 + ": " + ts3, if ts3 == 2 then Color.GREEN else if ts3 == 1 then Color.DARK_GREEN else if ts3 == -2 then Color.RED else if ts3 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 4 #####
def ts4 = calc_trend( symbol_4 );

plot row4_TRI = If( ts4 == 100 or ts4 == -100, 11, Double.NaN );
plot row4_SQ = If( ts4 == 2 or ts4 == -2, 11, Double.NaN );
plot row4_DASH = If( ts4 == 1 or ts4 == 0 or ts4 == -1, 11, Double.NaN );

row4_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row4_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row4_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row4_TRI.SetLineWeight( square_size );
row4_SQ.SetLineWeight( square_size );
row4_DASH.SetLineWeight( dash_size );

row4_TRI.AssignValueColor( if ts4 == 100 then Color.Green else if ts4 == -100 then Color.RED else Color.WHITE);
row4_SQ.AssignValueColor( if ts4 == 2 then Color.GREEN else if ts4 == -2 then Color.RED else Color.WHITE );
row4_DASH.AssignValueColor( if ts4 > 0 then Color.DARK_GREEN else if ts4 < 0 then Color.DARK_RED else Color.WHITE );

row4_TRI.HideTitle();
row4_SQ.HideTitle();
row4_DASH.HideTitle();

row4_TRI.HideBubble();
row4_SQ.HideBubble();
row4_DASH.HideBubble();

def last_data_bar_row4 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row4 = last_data_bar_row4 + minor;

AddChartBubble( barNumber() == bubble_loc_row4, 11, symbol_4 + ": " + ts4[minor], if ts4[minor] == 2 then Color.GREEN else if ts4[minor] == 1 then Color.DARK_GREEN else if ts4[minor] == -2 then Color.RED else if ts4[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_4 + ": " + ts4, if ts4 == 2 then Color.GREEN else if ts4 == 1 then Color.DARK_GREEN else if ts4 == -2 then Color.RED else if ts4 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 5 #####
def ts5 = calc_trend( symbol_0 );
plot row5_TRI = If( ts5 == 100 or ts5 == -100, 10, Double.NaN );
plot row5_SQ = If( ts5 == 2 or ts5 == -2, 10, Double.NaN );
plot row5_DASH = If( ts5 == 1 or ts5 == 0 or ts5 == -1, 10, Double.NaN );

row5_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row5_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row5_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row5_TRI.SetLineWeight( square_size );
row5_SQ.SetLineWeight( square_size );
row5_DASH.SetLineWeight( dash_size );

row5_TRI.AssignValueColor( if ts5 == 100 then Color.Green else if ts5 == -100 then Color.RED else Color.WHITE);
row5_SQ.AssignValueColor( if ts5 == 2 then Color.GREEN else if ts5 == -2 then Color.RED else Color.WHITE );
row5_DASH.AssignValueColor( if ts5 > 0 then Color.DARK_GREEN else if ts5 < 0 then Color.DARK_RED else Color.WHITE );

row5_TRI.HideTitle();
row5_SQ.HideTitle();
row5_DASH.HideTitle();

row5_TRI.HideBubble();
row5_SQ.HideBubble();
row5_DASH.HideBubble();

def last_data_bar_row5 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row5 = last_data_bar_row5 + major;

AddChartBubble( barNumber() == bubble_loc_row5, 10, symbol_5 + ": " + ts5[major], if ts5[major] == 2 then Color.GREEN else if ts5[major] == 1 then Color.DARK_GREEN else if ts5[major] == -2 then Color.RED else if ts5[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_5 + ": " + ts5, if ts5 == 2 then Color.GREEN else if ts5 == 1 then Color.DARK_GREEN else if ts5 == -2 then Color.RED else if ts5 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 6 #####
def ts6 = calc_trend( symbol_6 );

plot row6_TRI = If( ts6 == 100 or ts6 == -100, 9, Double.NaN );
plot row6_SQ = If( ts6 == 2 or ts6 == -2, 9, Double.NaN );
plot row6_DASH = If( ts6 == 1 or ts6 == 0 or ts6 == -1, 9, Double.NaN );

row6_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row6_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row6_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row6_TRI.SetLineWeight( square_size );
row6_SQ.SetLineWeight( square_size );
row6_DASH.SetLineWeight( dash_size );

row6_TRI.AssignValueColor( if ts6 == 100 then Color.Green else if ts6 == -100 then Color.RED else Color.WHITE);
row6_SQ.AssignValueColor( if ts6 == 2 then Color.GREEN else if ts6 == -2 then Color.RED else Color.WHITE );
row6_DASH.AssignValueColor( if ts6 > 0 then Color.DARK_GREEN else if ts6 < 0 then Color.DARK_RED else Color.WHITE );

row6_TRI.HideTitle();
row6_SQ.HideTitle();
row6_DASH.HideTitle();

row6_TRI.HideBubble();
row6_SQ.HideBubble();
row6_DASH.HideBubble();

def last_data_bar_row6 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row6 = last_data_bar_row6 + minor;

AddChartBubble( barNumber() == bubble_loc_row0, 9, symbol_6 + ": " + ts6[minor], if ts6[minor] == 2 then Color.GREEN else if ts6[minor] == 1 then Color.DARK_GREEN else if ts6[minor] == -2 then Color.RED else if ts6[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_6 + ": " + ts6, if ts6 == 2 then Color.GREEN else if ts6 == 1 then Color.DARK_GREEN else if ts6 == -2 then Color.RED else if ts6 == -1 then Color.DARK_RED else Color.YELLOW);
 

##### Row 7 #####
def ts7 = calc_trend( symbol_7 );

plot row7_TRI = If( ts7 == 100 or ts7 == -100, 8, Double.NaN );
plot row7_SQ = If( ts7 == 2 or ts7 == -2, 8, Double.NaN );
plot row7_DASH = If( ts7 == 1 or ts7 == 0 or ts7 == -1, 8, Double.NaN );

row7_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row7_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row7_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row7_TRI.SetLineWeight( square_size );
row7_SQ.SetLineWeight( square_size );
row7_DASH.SetLineWeight( dash_size );

row7_TRI.AssignValueColor( if ts7 == 100 then Color.Green else if ts7 == -100 then Color.RED else Color.WHITE);
row7_SQ.AssignValueColor( if ts7 == 2 then Color.GREEN else if ts7 == -2 then Color.RED else Color.WHITE );
row7_DASH.AssignValueColor( if ts7 > 0 then Color.DARK_GREEN else if ts7 < 0 then Color.DARK_RED else Color.WHITE );

row7_TRI.HideTitle();
row7_SQ.HideTitle();
row7_DASH.HideTitle();

row7_TRI.HideBubble();
row7_SQ.HideBubble();
row7_DASH.HideBubble();

def last_data_bar_row7 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row7 = last_data_bar_row7 + major;

AddChartBubble( barNumber() == bubble_loc_row7, 8, symbol_7 + ": " + ts7[major], if ts7[major] == 2 then Color.GREEN else if ts7[major] == 1 then Color.DARK_GREEN else if ts7[major] == -2 then Color.RED else if ts7[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_7 + ": " + ts7, if ts7 == 2 then Color.GREEN else if ts7 == 1 then Color.DARK_GREEN else if ts7 == -2 then Color.RED else if ts7 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 8 #####
def ts8 = calc_trend( symbol_8 );

plot row8_TRI = If( ts8 == 100 or ts8 == -100, 7, Double.NaN );
plot row8_SQ = If( ts8 == 2 or ts8 == -2, 7, Double.NaN );
plot row8_DASH = If( ts8 == 1 or ts8 == 0 or ts8 == -1, 7, Double.NaN );

row8_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row8_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row8_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row8_TRI.SetLineWeight( square_size );
row8_SQ.SetLineWeight( square_size );
row8_DASH.SetLineWeight( dash_size );

row8_TRI.AssignValueColor( if ts8 == 100 then Color.Green else if ts8 == -100 then Color.RED else Color.WHITE);
row8_SQ.AssignValueColor( if ts8 == 2 then Color.GREEN else if ts8 == -2 then Color.RED else Color.WHITE );
row8_DASH.AssignValueColor( if ts8 > 0 then Color.DARK_GREEN else if ts8 < 0 then Color.DARK_RED else Color.WHITE );

row8_TRI.HideTitle();
row8_SQ.HideTitle();
row8_DASH.HideTitle();

row8_TRI.HideBubble();
row8_SQ.HideBubble();
row8_DASH.HideBubble();

def last_data_bar_row8 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row8 = last_data_bar_row8 + minor;

AddChartBubble( barNumber() == bubble_loc_row8, 7, symbol_8 + ": " + ts8[minor], if ts8[minor] == 2 then Color.GREEN else if ts8[minor] == 1 then Color.DARK_GREEN else if ts8[minor] == -2 then Color.RED else if ts8[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_8 + ": " + ts8, if ts8 == 2 then Color.GREEN else if ts8 == 1 then Color.DARK_GREEN else if ts8 == -2 then Color.RED else if ts8 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 9 #####
def ts9 = calc_trend( symbol_9 );

plot row9_TRI = If( ts9 == 100 or ts9 == -100, 6, Double.NaN );
plot row9_SQ = If( ts9 == 2 or ts9 == -2, 6, Double.NaN );
plot row9_DASH = If( ts9 == 1 or ts9 == 0 or ts9 == -1, 6, Double.NaN );
row9_TRI.SetPaintingStrategy( PaintingStrategy.TRIANGLES );
row9_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row9_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row9_TRI.SetLineWeight( square_size );
row9_SQ.SetLineWeight( square_size );
row9_DASH.SetLineWeight( dash_size );

row9_TRI.AssignValueColor( if ts9 == 100 then Color.Green else if ts9 == -100 then Color.RED else Color.WHITE);
row9_SQ.AssignValueColor( if ts9 == 2 then Color.GREEN else if ts9 == -2 then Color.RED else Color.WHITE );
row9_DASH.AssignValueColor( if ts9 > 0 then Color.DARK_GREEN else if ts9 < 0 then Color.DARK_RED else Color.WHITE );

row9_TRI.HideTitle();
row9_SQ.HideTitle();
row9_DASH.HideTitle();

row9_TRI.HideBubble();
row9_SQ.HideBubble();
row9_DASH.HideBubble();

def last_data_bar_row9 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row9 = last_data_bar_row9 + major;

AddChartBubble( barNumber() == bubble_loc_row9, 6,  symbol_9 + ": " + ts9[major], if ts9[major] == 2 then Color.GREEN else if ts9[major] == 1 then Color.DARK_GREEN else if ts9[major] == -2 then Color.RED else if ts9[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_9 + ": " + ts9, if ts9 == 2 then Color.GREEN else if ts9 == 1 then Color.DARK_GREEN else if ts9 == -2 then Color.RED else if ts0 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 10 #####
def ts10 = calc_trend( symbol_10 );

plot row10_TRI = If( ts10 == 100 or ts10 == -100, 5, Double.NaN );
plot row10_SQ = If( ts10 == 2 or ts10 == -2, 5, Double.NaN );
plot row10_DASH = If( ts10 == 1 or ts10 == 0 or ts10 == -1, 5, Double.NaN );
row10_TRI.SetPaintingStrategy( PaintingStrategy.TRIANGLES );
row10_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row10_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row10_TRI.SetLineWeight( square_size );
row10_SQ.SetLineWeight( square_size );
row10_DASH.SetLineWeight( dash_size );

row10_TRI.AssignValueColor( if ts10 == 100 then Color.Green else if ts10 == -100 then Color.RED else Color.WHITE);
row10_SQ.AssignValueColor( if ts10 == 2 then Color.GREEN else if ts10 == -2 then Color.RED else Color.WHITE );
row10_DASH.AssignValueColor( if ts10 > 0 then Color.DARK_GREEN else if ts10 < 0 then Color.DARK_RED else Color.WHITE );

row10_TRI.HideTitle();
row10_SQ.HideTitle();
row10_DASH.HideTitle();

row10_TRI.HideBubble();
row10_SQ.HideBubble();
row10_DASH.HideBubble();

def last_data_bar_row10 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row10 = last_data_bar_row10 + minor;

AddChartBubble( barNumber() == bubble_loc_row10, 5,  symbol_10 + ": " + ts10[minor], if ts10[minor] == 2 then Color.GREEN else if ts10[minor] == 1 then Color.DARK_GREEN else if ts10[minor] == -2 then Color.RED else if ts10[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_10 + ": " + ts10, if ts10 == 2 then Color.GREEN else if ts10 == 1 then Color.DARK_GREEN else if ts10 == -2 then Color.RED else if ts0 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 11 #####
def ts11 = calc_trend( symbol_11 );

plot row11_TRI = If( ts11 == 100 or ts11 == -100, 4, Double.NaN );
plot row11_SQ = If( ts11 == 2 or ts11 == -2, 4, Double.NaN );
plot row11_DASH = If( ts11 == 1 or ts11 == 0 or ts11 == -1, 4, Double.NaN );
row11_TRI.SetPaintingStrategy( PaintingStrategy.TRIANGLES );
row11_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row11_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row11_TRI.SetLineWeight( square_size );
row11_SQ.SetLineWeight( square_size );
row11_DASH.SetLineWeight( dash_size );

row11_TRI.AssignValueColor( if ts11 == 100 then Color.Green else if ts11 == -100 then Color.RED else Color.WHITE);
row11_SQ.AssignValueColor( if ts11 == 2 then Color.GREEN else if ts11 == -2 then Color.RED else Color.WHITE );
row11_DASH.AssignValueColor( if ts11 > 0 then Color.DARK_GREEN else if ts11 < 0 then Color.DARK_RED else Color.WHITE );

row11_TRI.HideTitle();
row11_SQ.HideTitle();
row11_DASH.HideTitle();

row11_TRI.HideBubble();
row11_SQ.HideBubble();
row11_DASH.HideBubble();

def last_data_bar_row11 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row11 = last_data_bar_row11 + major;

AddChartBubble( barNumber() == bubble_loc_row11, 4,  symbol_11 + ": " + ts11[major], if ts11[major] == 2 then Color.GREEN else if ts11[major] == 1 then Color.DARK_GREEN else if ts11[major] == -2 then Color.RED else if ts11[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_11 + ": " + ts11, if ts11 == 2 then Color.GREEN else if ts11 == 1 then Color.DARK_GREEN else if ts11 == -2 then Color.RED else if ts0 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 12 #####
def ts12 = calc_trend( symbol_12 );

plot row12_TRI = If( ts12 == 100 or ts12 == -100, 3, Double.NaN );
plot row12_SQ = If( ts12 == 2 or ts12 == -2, 3, Double.NaN );
plot row12_DASH = If( ts12 == 1 or ts12 == 0 or ts12 == -1, 3, Double.NaN );

row12_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row12_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row12_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row12_TRI.SetLineWeight( square_size );
row12_SQ.SetLineWeight( square_size );
row12_DASH.SetLineWeight( dash_size );

row12_TRI.AssignValueColor( if ts12 == 100 then Color.Green else if ts12 == -100 then Color.RED else Color.WHITE);
row12_SQ.AssignValueColor( if ts12 == 2 then Color.GREEN else if ts12 == -2 then Color.RED else Color.WHITE );
row12_DASH.AssignValueColor( if ts12 > 0 then Color.DARK_GREEN else if ts12 < 0 then Color.DARK_RED else Color.WHITE );

row12_TRI.HideTitle();
row12_SQ.HideTitle();
row12_DASH.HideTitle();

row12_TRI.HideBubble();
row12_SQ.HideBubble();
row12_DASH.HideBubble();

def last_data_bar_row12 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row12 = last_data_bar_row12 + minor;

AddChartBubble( barNumber() == bubble_loc_row0, 3, symbol_12 + ": " + ts12[minor], if ts12[minor] == 2 then Color.GREEN else if ts12[minor] == 1 then Color.DARK_GREEN else if ts12[minor] == -2 then Color.RED else if ts12[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_12 + ": " + ts12, if ts12 == 2 then Color.GREEN else if ts12 == 1 then Color.DARK_GREEN else if ts12 == -2 then Color.RED else if ts12 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 13 #####
def ts13 = calc_trend( symbol_13 );

plot row13_TRI = If( ts13 == 100 or ts13 == -100, 2, Double.NaN );
plot row13_SQ = If( ts13 == 2 or ts13 == -2, 2, Double.NaN );
plot row13_DASH = If( ts13 == 1 or ts13 == 0 or ts13 == -1, 2, Double.NaN );
row13_TRI.SetPaintingStrategy( PaintingStrategy.TRIANGLES );
row13_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row13_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row13_TRI.SetLineWeight( square_size );
row13_SQ.SetLineWeight( square_size );
row13_DASH.SetLineWeight( dash_size );

row13_TRI.AssignValueColor( if ts13 == 100 then Color.Green else if ts13 == -100 then Color.RED else Color.WHITE);
row13_SQ.AssignValueColor( if ts13 == 2 then Color.GREEN else if ts13 == -2 then Color.RED else Color.WHITE );
row13_DASH.AssignValueColor( if ts13 > 0 then Color.DARK_GREEN else if ts13 < 0 then Color.DARK_RED else Color.WHITE );

row13_TRI.HideTitle();
row13_SQ.HideTitle();
row13_DASH.HideTitle();

row13_TRI.HideBubble();
row13_SQ.HideBubble();
row13_DASH.HideBubble();

def last_data_bar_row13 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row13 = last_data_bar_row13 + major;

AddChartBubble( barNumber() == bubble_loc_row13, 2,  symbol_13 + ": " + ts13[major], if ts13[major] == 2 then Color.GREEN else if ts13[major] == 1 then Color.DARK_GREEN else if ts13[major] == -2 then Color.RED else if ts13[major] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_13 + ": " + ts13, if ts13 == 2 then Color.GREEN else if ts13 == 1 then Color.DARK_GREEN else if ts13 == -2 then Color.RED else if ts0 == -1 then Color.DARK_RED else Color.YELLOW);


##### Row 14 #####
def ts14 = calc_trend( symbol_14 );

plot row14_TRI = If( ts14 == 100 or ts14 == -100, 1, Double.NaN );
plot row14_SQ = If( ts14 == 2 or ts14 == -2, 1, Double.NaN );
plot row14_DASH = If( ts14 == 1 or ts14 == 0 or ts14 == -1, 1, Double.NaN );

row14_TRI.SetPaintingStrategy ( PaintingStrategy.TRIANGLES );
row14_SQ.SetPaintingStrategy( PaintingStrategy.LINE_VS_SQUARES );
row14_DASH.SetPaintingStrategy( PaintingStrategy.DASHES );

row14_TRI.SetLineWeight( square_size );
row14_SQ.SetLineWeight( square_size );
row14_DASH.SetLineWeight( dash_size );

row14_TRI.AssignValueColor( if ts14 == 100 then Color.Green else if ts14 == -100 then Color.RED else Color.WHITE);
row14_SQ.AssignValueColor( if ts14 == 2 then Color.GREEN else if ts14 == -2 then Color.RED else Color.WHITE );
row14_DASH.AssignValueColor( if ts14 > 0 then Color.DARK_GREEN else if ts14 < 0 then Color.DARK_RED else Color.WHITE );

row14_TRI.HideTitle();
row14_SQ.HideTitle();
row14_DASH.HideTitle();

row14_TRI.HideBubble();
row14_SQ.HideBubble();
row14_DASH.HideBubble();

def last_data_bar_row14 = HighestAll( if IsNaN(close) then Double.NaN else barNumber() );
def bubble_loc_row14 = last_data_bar_row14 + minor;

AddChartBubble( barNumber() == bubble_loc_row0, 1, symbol_14 + ": " + ts14[minor], if ts14[minor] == 2 then Color.GREEN else if ts14[minor] == 1 then Color.DARK_GREEN else if ts14[minor] == -2 then Color.RED else if ts14[minor] == -1 then Color.DARK_RED else Color.YELLOW, yes);
AddLabel( show_labels, symbol_14 + ": " + ts14, if ts14 == 2 then Color.GREEN else if ts14 == 1 then Color.DARK_GREEN else if ts14 == -2 then Color.RED else if ts14 == -1 then Color.DARK_RED else Color.YELLOW);



plot rule_0 = 5.5;
rule_0.HideBubble();
rule_0.HideTitle();
rule_0.SetDefaultColor( Color.LIGHT_GRAY );

plot rule_1 = 10.5;
rule_1.HideBubble();
rule_1.HideTitle();
rule_1.SetDefaultColor( Color.LIGHT_GRAY );