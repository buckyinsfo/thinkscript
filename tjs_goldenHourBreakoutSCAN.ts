# Golden Hour Breakout Scan
# ---------------------------------------------------------------
# Scan version - finds stocks with golden hour breakout conditions
# Times are Pacific. Market open = 6:30 AM PT, close = 1:00 PM PT.
# ---------------------------------------------------------------

declare lower;

# -------- Inputs --------
input openingRangeMinutes = 30;   # length of the opening range window
input cutoffMinutes       = 120;  # how long after the open signals are valid
input volumeMultiplier    = 1.5;  # current bar must exceed this x avg vol

# -------- Session anchors (Pacific Time) --------
def marketOpen        = 0630;
def openingRangeEnd   = marketOpen + (openingRangeMinutes / 60) * 100
                                   + (openingRangeMinutes % 60);
def cutoffTime        = marketOpen + (cutoffMinutes / 60) * 100
                                   + (cutoffMinutes % 60);

# -------- Time flags --------
def inOpeningRange = SecondsFromTime(marketOpen) >= 0
                 and SecondsTillTime(openingRangeEnd) > 0;
def afterOpeningRange = SecondsFromTime(openingRangeEnd) >= 0;
def beforeCutoff = SecondsTillTime(cutoffTime) > 0;
def regularSession = SecondsFromTime(marketOpen) >= 0
                 and SecondsTillTime(1300) > 0;

# -------- Build the opening range high & average volume --------
def isNewDay = GetDay() != GetDay()[1];

def orHigh = if isNewDay then Double.NaN
             else if inOpeningRange and !IsNaN(high)
                then (if IsNaN(orHigh[1]) then high
                      else Max(orHigh[1], high))
             else orHigh[1];

def orBarCount = if isNewDay then 0
                 else if inOpeningRange then
                    (if IsNaN(orBarCount[1]) then 1 else orBarCount[1] + 1)
                 else orBarCount[1];

def orVolSum = if isNewDay then 0
               else if inOpeningRange then
                  (if IsNaN(orVolSum[1]) then volume else orVolSum[1] + volume)
               else orVolSum[1];

def orAvgVol = if orBarCount > 0 then orVolSum / orBarCount else Double.NaN;

# -------- VWAP --------
def vwapValue = reference VWAP().VWAP;

# -------- Signal conditions --------
def condBreakout   = close > orHigh;
def condVolume     = volume >= volumeMultiplier * orAvgVol;
def condAboveVWAP  = close > vwapValue;
def condTimeWindow = afterOpeningRange and beforeCutoff and regularSession;

def signal = condBreakout
         and condVolume
         and condAboveVWAP
         and condTimeWindow;

# -------- Scan output --------
plot scan = signal;