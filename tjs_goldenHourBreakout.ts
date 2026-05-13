# Golden Hour Breakout
# ---------------------------------------------------------------
# Fires on a bar CLOSE when all of the following are true:
#   1. Price closes above the high of the 6:30-7:00 AM PT opening range
#   2. Current bar volume >= 1.5x the average per-bar volume of that
#      opening 30-minute range
#   3. Price is above VWAP
#   4. Time is within the first 2 hours of the session (before 8:30 AM PT)
#
# Times are Pacific. Market open = 6:30 AM PT, close = 1:00 PM PT.
# Works on any intraday timeframe (1m, 3m, 5m, 15m, etc.).
# Recommended: 5-minute chart.
#
# IMPORTANT: Set Thinkorswim to Pacific time:
#   Setup -> Application Settings -> General -> Time zone -> Pacific
# ---------------------------------------------------------------

declare upper;

# -------- Inputs --------
input openingRangeMinutes = 30;   # length of the opening range window
input cutoffMinutes       = 120;  # how long after the open signals are valid
input volumeMultiplier    = 1.5;  # current bar must exceed this x avg vol
input showCloud           = yes;  # light-green background when signal fires
input showLabels          = yes;  # on-chart status labels
input showArrow           = yes;  # green triangle on breakout bar

# -------- Session anchors (Pacific Time) --------
# Thinkorswim's SecondsFromTime() uses the chart's timezone. Set your TOS
# timezone to Pacific (Setup -> Application Settings -> General -> Time zone)
# so 0630 = market open for you.
def marketOpen        = 0630;
def openingRangeEnd   = marketOpen + (openingRangeMinutes / 60) * 100
                                   + (openingRangeMinutes % 60);
# ^ converts minutes into HHMM form (e.g. 30 min past 0630 = 0700)

def cutoffTime        = marketOpen + (cutoffMinutes / 60) * 100
                                   + (cutoffMinutes % 60);
# ^ e.g. 120 min past 0630 = 0830

# -------- Time flags --------
# True while we are inside the 6:30-7:00 window (building the range)
def inOpeningRange = SecondsFromTime(marketOpen) >= 0
                 and SecondsTillTime(openingRangeEnd) > 0;

# True after the opening range has finished for the day
def afterOpeningRange = SecondsFromTime(openingRangeEnd) >= 0;

# True while still inside the 2-hour signal window
def beforeCutoff = SecondsTillTime(cutoffTime) > 0;

# True only during regular session (ignore pre/post market)
def regularSession = SecondsFromTime(marketOpen) >= 0
                 and SecondsTillTime(1300) > 0;

# -------- Build the opening range high & average volume --------
# We accumulate high and volume only while inOpeningRange is true, and
# freeze the values once the window ends. Reset each new day.

def isNewDay = GetDay() != GetDay()[1];

# Running high of the opening range
def orHigh = if isNewDay then Double.NaN
             else if inOpeningRange and !IsNaN(high)
                then (if IsNaN(orHigh[1]) then high
                      else Max(orHigh[1], high))
             else orHigh[1];

# Count of bars inside the opening range (for averaging volume)
def orBarCount = if isNewDay then 0
                 else if inOpeningRange then
                    (if IsNaN(orBarCount[1]) then 1 else orBarCount[1] + 1)
                 else orBarCount[1];

# Cumulative volume inside the opening range
def orVolSum = if isNewDay then 0
               else if inOpeningRange then
                  (if IsNaN(orVolSum[1]) then volume else orVolSum[1] + volume)
               else orVolSum[1];

# Average per-bar volume of the opening range (only meaningful after window closes)
def orAvgVol = if orBarCount > 0 then orVolSum / orBarCount else Double.NaN;

# -------- VWAP --------
# Thinkorswim has a built-in VWAP reference
def vwapValue = reference VWAP().VWAP;

# -------- Signal conditions (evaluated on bar close) --------
# Note: ThinkScript evaluates the last bar intrabar by default. Gating on
# IsNaN(close[-1]) == false would require future data; instead we rely on
# AlertLine below using Alert.BAR, which only fires when the bar closes.

def condBreakout   = close > orHigh;
def condVolume     = volume >= volumeMultiplier * orAvgVol;
def condAboveVWAP  = close > vwapValue;
def condTimeWindow = afterOpeningRange and beforeCutoff and regularSession;

def signal = condBreakout
         and condVolume
         and condAboveVWAP
         and condTimeWindow;

# -------- Plot: opening range high line --------
plot ORHigh = if regularSession and afterOpeningRange then orHigh
              else Double.NaN;
ORHigh.SetDefaultColor(Color.GRAY);
ORHigh.SetStyle(Curve.SHORT_DASH);
ORHigh.SetLineWeight(2);

# -------- Plot: green triangle above breakout bar --------
plot BreakoutArrow = if signal then high else Double.NaN;
BreakoutArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
# ^ ARROW_DOWN points down at the bar from above, which reads as
#   "triangle above the bar." Swap to ARROW_UP if you prefer it below.
BreakoutArrow.SetDefaultColor(Color.GREEN);
BreakoutArrow.SetLineWeight(3);

# -------- Background tint when signal fires --------
AddCloud(if showCloud and signal then high * 1.001 else Double.NaN,
         if showCloud and signal then low  * 0.999 else Double.NaN,
         CreateColor(200, 255, 200),   # light green
         CreateColor(200, 255, 200));

# -------- Status labels --------
# One summary label + per-condition labels so you can see at a glance
# which requirements are failing on any given bar.

AddLabel(showLabels,
         "OR High: " + (if IsNaN(orHigh) then "building..."
                        else AsDollars(orHigh)),
         Color.LIGHT_GRAY);

AddLabel(showLabels and afterOpeningRange,
         "Avg OR Vol: " + Round(orAvgVol, 0),
         Color.LIGHT_GRAY);

AddLabel(showLabels and afterOpeningRange,
         "Breakout: " + (if condBreakout then "YES" else "no"),
         if condBreakout then Color.GREEN else Color.GRAY);

AddLabel(showLabels and afterOpeningRange,
         "Vol 1.5x: " + (if condVolume then "YES" else "no"),
         if condVolume then Color.GREEN else Color.GRAY);

AddLabel(showLabels and afterOpeningRange,
         "Above VWAP: " + (if condAboveVWAP then "YES" else "no"),
         if condAboveVWAP then Color.GREEN else Color.GRAY);

AddLabel(showLabels,
         "In Window: " + (if condTimeWindow then "YES" else "no"),
         if condTimeWindow then Color.GREEN else Color.GRAY);

AddLabel(showLabels and signal,
         ">>> GOLDEN HOUR BREAKOUT <<<",
         Color.GREEN);

# -------- Alert (fires once per bar, on bar close) --------
Alert(signal,
      GetSymbol() + " breakout @ " + close + " at " + GetTime(),
      Alert.BAR,        # <-- key: only fires when the bar CLOSES
      Sound.Ring);