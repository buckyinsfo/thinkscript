#
# TD Ameritrade IP Company, Inc. (c) 2009-2014
#

def HH = HighestAll(high);
def LL = LowestAll(low);

plot G1 = HH / 2;
plot G2 = (HH + LL) / 2;
plot G3 = HH / 4;
plot G4 = (HH - LL) / 4 + LL;

G1.SetDefaultColor(GetColor(3));
G1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
G2.SetDefaultColor(GetColor(3));
G2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
G3.SetDefaultColor(GetColor(3));
G3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
G4.SetDefaultColor(GetColor(3));
G4.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);