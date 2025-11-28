import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const ROULETTE_NUMBERS = [
  { num: 0, color: 'green' },
  { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' }, { num: 4, color: 'black' },
  { num: 21, color: 'red' }, { num: 2, color: 'black' }, { num: 25, color: 'red' }, { num: 17, color: 'black' },
  { num: 34, color: 'red' }, { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
  { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' }, { num: 8, color: 'black' },
  { num: 23, color: 'red' }, { num: 10, color: 'black' }, { num: 5, color: 'red' }, { num: 24, color: 'black' },
  { num: 16, color: 'red' }, { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
  { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' }, { num: 22, color: 'black' },
  { num: 18, color: 'red' }, { num: 29, color: 'black' }, { num: 7, color: 'red' }, { num: 28, color: 'black' },
  { num: 12, color: 'red' }, { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
];

interface Bet {
  type: 'red' | 'black' | 'number';
  value: number | null;
  amount: number;
}

interface HistoryItem {
  number: number;
  color: string;
  result: 'win' | 'lose';
  profit: number;
}

const Index = () => {
  const [balance, setBalance] = useState(10000);
  const [hasHouse, setHasHouse] = useState(true);
  const [hasVanya, setHasVanya] = useState(true);
  const [hasAlina, setHasAlina] = useState(true);
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  const placeBet = (type: 'red' | 'black' | 'number', value: number | null = null) => {
    if (betAmount > balance && betAmount !== 999999 && betAmount !== 888888 && betAmount !== 777777) {
      toast({ title: 'Недостаточно средств', variant: 'destructive' });
      return;
    }
    if (betAmount === 999999 && !hasHouse) {
      toast({ title: 'У вас нет дома!', variant: 'destructive' });
      return;
    }
    if (betAmount === 888888 && !hasVanya) {
      toast({ title: 'У вас нет Вани!', variant: 'destructive' });
      return;
    }
    if (betAmount === 777777 && !hasAlina) {
      toast({ title: 'У вас нет Алины!', variant: 'destructive' });
      return;
    }
    setCurrentBet({ type, value, amount: betAmount });
    if (betAmount !== 999999 && betAmount !== 888888 && betAmount !== 777777) {
      setBalance(balance - betAmount);
    } else if (betAmount === 999999) {
      setHasHouse(false);
    } else if (betAmount === 888888) {
      setHasVanya(false);
    } else if (betAmount === 777777) {
      setHasAlina(false);
    }
    toast({ 
      title: betAmount === 999999 ? '🏠 Дом поставлен на кон!' : betAmount === 888888 ? '👤 Ваня поставлен на кон!' : betAmount === 777777 ? '💃 Алина поставлена на кон!' : 'Ставка принята', 
      description: betAmount === 999999 ? `Ставка: ДОМ на ${type === 'number' ? `число ${value}` : type === 'red' ? 'красное' : 'чёрное'}` : betAmount === 888888 ? `Ставка: ВАНЯ на ${type === 'number' ? `число ${value}` : type === 'red' ? 'красное' : 'чёрное'}` : betAmount === 777777 ? `Ставка: АЛИНА на ${type === 'number' ? `число ${value}` : type === 'red' ? 'красное' : 'чёрное'}` : `${betAmount}₽ на ${type === 'number' ? `число ${value}` : type === 'red' ? 'красное' : 'чёрное'}`,
      className: (betAmount === 999999 || betAmount === 888888 || betAmount === 777777) ? 'bg-destructive border-casino-gold' : ''
    });
  };

  const spinRoulette = () => {
    if (!currentBet) {
      toast({ title: 'Сделайте ставку', variant: 'destructive' });
      return;
    }

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const result = ROULETTE_NUMBERS[randomIndex];

    setTimeout(() => {
      setWinningNumber(result.num);
      setIsSpinning(false);

      let won = false;
      let winAmount = 0;

      if (currentBet.type === 'number' && currentBet.value === result.num) {
        won = true;
        winAmount = currentBet.amount * 36;
      } else if (currentBet.type === result.color && result.color !== 'green') {
        won = true;
        winAmount = currentBet.amount * 2;
      }

      if (won) {
        if (currentBet.amount === 999999) {
          setHasHouse(true);
          setBalance(balance + winAmount);
          toast({ 
            title: '🎉🏠 НЕВЕРОЯТНО! ДОМ СОХРАНЁН!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Дом остаётся ваш + ${winAmount}₽!`,
            className: 'bg-casino-green border-casino-gold text-lg font-bold'
          });
        } else if (currentBet.amount === 888888) {
          setHasVanya(true);
          setBalance(balance + winAmount);
          toast({ 
            title: '🎉👤 ВАНЯ СПАСЁН!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Ваня остаётся с вами + ${winAmount}₽!`,
            className: 'bg-casino-green border-casino-gold text-lg font-bold'
          });
        } else if (currentBet.amount === 777777) {
          setHasAlina(true);
          setBalance(balance + winAmount);
          toast({ 
            title: '🎉💃 АЛИНА СПАСЕНА!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Алина остаётся с вами + ${winAmount}₽!`,
            className: 'bg-casino-green border-casino-gold text-lg font-bold'
          });
        } else {
          setBalance(balance + winAmount);
          toast({ 
            title: '🎉 Победа!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Выигрыш: ${winAmount}₽`,
            className: 'bg-casino-green border-casino-gold'
          });
        }
      } else {
        if (currentBet.amount === 999999) {
          toast({ 
            title: '💔 ДОМ ПРОИГРАН!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Вы остались без дома...`,
            variant: 'destructive',
            className: 'text-lg font-bold'
          });
        } else if (currentBet.amount === 888888) {
          toast({ 
            title: '💔 ВАНЯ ПРОИГРАН!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Ваня теперь не ваш...`,
            variant: 'destructive',
            className: 'text-lg font-bold'
          });
        } else if (currentBet.amount === 777777) {
          toast({ 
            title: '💔 АЛИНА ПРОИГРАНА!', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'}). Алина теперь не ваша...`,
            variant: 'destructive',
            className: 'text-lg font-bold'
          });
        } else {
          toast({ 
            title: 'Проигрыш', 
            description: `Выпало ${result.num} (${result.color === 'red' ? 'красное' : result.color === 'black' ? 'чёрное' : 'зелёное'})`,
            variant: 'destructive'
          });
        }
      }

      setHistory(prev => [{
        number: result.num,
        color: result.color,
        result: won ? 'win' : 'lose',
        profit: won ? winAmount - currentBet.amount : -currentBet.amount
      }, ...prev.slice(0, 9)]);

      setCurrentBet(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold text-primary flex items-center justify-center gap-3">
            <Icon name="Coins" size={56} className="text-casino-gold" />
            Казино Рулетка
          </h1>
          <p className="text-xl text-muted-foreground">Классическая игра в европейскую рулетку</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card/80 backdrop-blur border-2 border-primary/20">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  <div 
                    className={`absolute inset-0 rounded-full border-8 border-casino-gold bg-gradient-to-br from-card to-muted shadow-2xl ${isSpinning ? 'animate-spin-slow' : ''}`}
                  >
                    {ROULETTE_NUMBERS.map((item, idx) => {
                      const angle = (idx / ROULETTE_NUMBERS.length) * 360;
                      return (
                        <div
                          key={idx}
                          className="absolute w-full h-full"
                          style={{ transform: `rotate(${angle}deg)` }}
                        >
                          <div 
                            className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-12 flex items-center justify-center text-white font-bold text-sm ${
                              item.color === 'red' ? 'bg-casino-red' : item.color === 'black' ? 'bg-casino-black' : 'bg-casino-green'
                            } rounded-sm shadow-lg`}
                          >
                            {item.num}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-casino-gold border-4 border-foreground shadow-xl flex items-center justify-center">
                    {winningNumber !== null && !isSpinning && (
                      <span className="text-3xl font-bold text-background animate-pulse-glow">
                        {winningNumber}
                      </span>
                    )}
                  </div>

                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-casino-gold"></div>
                </div>

                <Button 
                  onClick={spinRoulette}
                  disabled={isSpinning || !currentBet}
                  size="lg"
                  className="w-full max-w-md h-14 text-xl font-bold bg-casino-gold hover:bg-casino-gold/90 text-background shadow-lg"
                >
                  {isSpinning ? (
                    <>
                      <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
                      Вращается...
                    </>
                  ) : (
                    <>
                      <Icon name="Play" className="mr-2 h-6 w-6" />
                      Запустить рулетку
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur border-2 border-primary/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Gamepad2" size={24} className="text-casino-gold" />
                Панель ставок
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Сумма ставки:</label>
                  <div className="flex gap-2 flex-wrap">
                    {[100, 500, 1000, 5000, 9999, 10000, 777777, 888888, 999999].map(amount => (
                      <Button
                        key={amount}
                        variant={betAmount === amount ? 'default' : 'outline'}
                        onClick={() => setBetAmount(amount)}
                        size="sm"
                        className={(amount === 999999 || amount === 888888 || amount === 777777) ? 'bg-destructive hover:bg-destructive/90 text-white font-bold' : ''}
                      >
                        {amount === 999999 ? '🏠 ДОМ' : amount === 888888 ? '👤 ВАНЯ' : amount === 777777 ? '💃 АЛИНА' : `${amount}₽`}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => placeBet('red')}
                    disabled={isSpinning}
                    className="h-16 bg-casino-red hover:bg-casino-red/90 text-white font-bold text-lg"
                  >
                    <Icon name="Circle" className="mr-2 fill-current" />
                    Красное x2
                  </Button>
                  <Button
                    onClick={() => placeBet('black')}
                    disabled={isSpinning}
                    className="h-16 bg-casino-black hover:bg-casino-black/80 text-white font-bold text-lg"
                  >
                    <Icon name="Circle" className="mr-2 fill-current" />
                    Чёрное x2
                  </Button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {[...Array(36)].map((_, i) => {
                    const num = i + 1;
                    const rouletteItem = ROULETTE_NUMBERS.find(n => n.num === num);
                    return (
                      <Button
                        key={num}
                        onClick={() => placeBet('number', num)}
                        disabled={isSpinning}
                        variant="outline"
                        className={`h-12 font-bold ${
                          rouletteItem?.color === 'red' ? 'border-casino-red text-casino-red hover:bg-casino-red hover:text-white' : 'border-casino-black hover:bg-casino-black hover:text-white'
                        }`}
                      >
                        {num}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card/80 backdrop-blur border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Wallet" size={28} className="text-casino-gold" />
                Баланс
              </h3>
              <p className="text-4xl font-bold text-casino-gold">{balance.toLocaleString()}₽</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name="Home" size={20} className={hasHouse ? 'text-casino-green' : 'text-muted-foreground'} />
                  <span className={`text-sm font-medium ${hasHouse ? 'text-casino-green' : 'text-muted-foreground line-through'}`}>
                    {hasHouse ? 'Дом в наличии' : 'Дома нет'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="User" size={20} className={hasVanya ? 'text-casino-green' : 'text-muted-foreground'} />
                  <span className={`text-sm font-medium ${hasVanya ? 'text-casino-green' : 'text-muted-foreground line-through'}`}>
                    {hasVanya ? 'Ваня в наличии' : 'Вани нет'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={20} className={hasAlina ? 'text-casino-green' : 'text-muted-foreground'} />
                  <span className={`text-sm font-medium ${hasAlina ? 'text-casino-green' : 'text-muted-foreground line-through'}`}>
                    {hasAlina ? 'Алина в наличии' : 'Алины нет'}
                  </span>
                </div>
              </div>
              {currentBet && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Текущая ставка:</p>
                  <p className="font-bold">
                    {currentBet.amount}₽ на {currentBet.type === 'number' ? `№${currentBet.value}` : currentBet.type === 'red' ? 'красное' : 'чёрное'}
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur border-2 border-primary/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="History" size={24} className="text-casino-gold" />
                История ({history.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      item.result === 'win' ? 'bg-casino-green/20 border-casino-green' : 'bg-destructive/20 border-destructive'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            item.color === 'red' ? 'bg-casino-red' : item.color === 'black' ? 'bg-casino-black' : 'bg-casino-green'
                          }`}
                        >
                          {item.number}
                        </div>
                        <span className="text-sm font-medium">
                          {item.result === 'win' ? 'Выигрыш' : 'Проигрыш'}
                        </span>
                      </div>
                      <span className={`font-bold ${item.profit > 0 ? 'text-casino-green' : 'text-destructive'}`}>
                        {item.profit > 0 ? '+' : ''}{item.profit}₽
                      </span>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    История пока пуста
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;