import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Rocket,
  Plane,
  TrendingUp,
  Cherry,
  Grape,
  Apple,
  Wallet,
  LogOut,
  Plus,
  Bitcoin,
  Banknote,
  Smartphone,
  Building2,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import { DepositTutorial } from '../components/deposit-tutorial';

const GAMES = [
  {
    id: 'aviator',
    name: 'Aviator',
    nameAmharic: 'አቪዬተር',
    icon: Plane,
    color: 'from-red-600 to-orange-600',
    description: 'Classic crash game',
    descAmharic: 'ክላሲክ የጨዋታ ዓይነት',
  },
  {
    id: 'jetx',
    name: 'JetX',
    nameAmharic: 'ጀትኤክስ',
    icon: Rocket,
    color: 'from-blue-600 to-purple-600',
    description: 'Fast-paced multiplier',
    descAmharic: 'ፈጣን የጨዋታ ዓይነት',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    nameAmharic: 'ሮኬት',
    icon: TrendingUp,
    color: 'from-green-600 to-emerald-600',
    description: 'High stakes action',
    descAmharic: 'ከፍተኛ ትርፍ ያለው',
  },
];

const FRUIT_GAMES = [
  {
    id: 'fruits-1',
    name: 'Lucky Fruits',
    nameAmharic: 'እድለኛ ፍሬዎች',
    icon: Cherry,
    color: 'from-pink-600 to-red-600',
  },
  {
    id: 'fruits-2',
    name: 'Fruit Party',
    nameAmharic: 'የፍራፍሬ ድግስ',
    icon: Grape,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'fruits-3',
    name: 'Sweet Bonanza',
    nameAmharic: 'ጣፋጭ ጨዋታ',
    icon: Apple,
    color: 'from-yellow-600 to-orange-600',
  },
];

export function GameLobby() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(5000);
  const [depositOpen, setDepositOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState('');
  const phoneNumber = localStorage.getItem('user_phone') || '';

  const handleLogout = () => {
    localStorage.removeItem('user_phone');
    toast.success('በተሳካ ሁኔታ ወጥተዋል / Logged out successfully');
    navigate('/');
  };

  const handleDeposit = (amount: number, method: string) => {
    setBalance((prev) => prev + amount);
    toast.success(
      `${amount} ብር በተሳካ ሁኔታ ገብቷል በ${method} / ${amount} Birr deposited successfully via ${method}`,
      { icon: '💰' }
    );
    setDepositOpen(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    toast.success(`${label} ተገልብጧል / ${label} copied!`, { icon: '📋' });
    setTimeout(() => setCopiedAccount(''), 2000);
  };

  return (
    <div className="size-full bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-auto">
      <Toaster position="top-center" theme="dark" />

      <div className="min-h-full max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              እናት ቤት
            </h1>
            <p className="text-sm text-gray-400 mt-1">+251 {phoneNumber}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance */}
            <div className="bg-gradient-to-br from-green-950 to-emerald-900 border border-green-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300 font-semibold">
                  ቀሪ ሂሳብ / BALANCE
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {balance.toFixed(2)} ብር
              </div>
            </div>

            {/* Deposit button */}
            <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 h-full px-6">
                  <Plus className="w-5 h-5 mr-2" />
                  ገንዘብ ያስገቡ / Deposit
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ገንዘብ ያስገቡ / Deposit Funds
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-base">
                    የመክፈያ ዘዴዎን ይምረጡ / Choose your preferred payment method
                  </DialogDescription>
                </DialogHeader>

                {/* Tutorial Video Section */}
                <DepositTutorial />

                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-200">
                    💳 የመክፈያ ዘዴዎች / Payment Methods
                  </h3>

                  <Tabs defaultValue="telebirr" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-800 p-1 h-auto">
                      <TabsTrigger value="telebirr" className="data-[state=active]:bg-green-600 flex flex-col gap-1 py-3">
                        <Smartphone className="w-5 h-5" />
                        <span className="text-xs font-bold">Telebirr</span>
                      </TabsTrigger>
                      <TabsTrigger value="cbebirr" className="data-[state=active]:bg-blue-600 flex flex-col gap-1 py-3">
                        <Smartphone className="w-5 h-5" />
                        <span className="text-xs font-bold">CBE Birr</span>
                      </TabsTrigger>
                      <TabsTrigger value="bank" className="data-[state=active]:bg-purple-600 flex flex-col gap-1 py-3">
                        <Building2 className="w-5 h-5" />
                        <span className="text-xs font-bold">Bank</span>
                      </TabsTrigger>
                      <TabsTrigger value="crypto" className="data-[state=active]:bg-orange-600 flex flex-col gap-1 py-3">
                        <Bitcoin className="w-5 h-5" />
                        <span className="text-xs font-bold">Crypto</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Telebirr Tab */}
                    <TabsContent value="telebirr" className="space-y-4 mt-6">
                      <div className="bg-gradient-to-br from-green-950 to-emerald-950 border border-green-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-green-500 rounded-full p-3">
                            <Smartphone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">
                              Telebirr (ቴሌ ብር)
                            </h4>
                            <p className="text-sm text-green-300">
                              ፈጣን እና ደህንነቱ የተጠበቀ / Fast & Secure
                            </p>
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                          <Label className="text-gray-300 mb-2 block">
                            የእናት ቤት Telebirr መለያ / Enat Bet Telebirr Account
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value="+251 911 234 567"
                              readOnly
                              className="bg-gray-800 border-green-500/50 text-white font-mono text-lg"
                            />
                            <Button
                              onClick={() =>
                                copyToClipboard('+251911234567', 'Telebirr Account')
                              }
                              className="bg-green-600 hover:bg-green-500"
                            >
                              {copiedAccount === 'Telebirr Account' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Amount Selection */}
                        <Label className="text-gray-300 mb-2 block">
                          መጠን ይምረጡ / Select Amount
                        </Label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                            <Button
                              key={amount}
                              onClick={() => handleDeposit(amount, 'Telebirr')}
                              className="bg-green-700 hover:bg-green-600 font-bold h-12"
                            >
                              {amount} ብር
                            </Button>
                          ))}
                        </div>

                        {/* Custom Amount */}
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="ሌላ መጠን / Custom amount"
                            className="bg-gray-800 border-green-500/50"
                            id="telebirr-custom"
                          />
                          <Button
                            onClick={() => {
                              const input = document.getElementById(
                                'telebirr-custom'
                              ) as HTMLInputElement;
                              const amount = parseFloat(input.value);
                              if (amount > 0) handleDeposit(amount, 'Telebirr');
                            }}
                            className="bg-green-600 hover:bg-green-500 px-8"
                          >
                            ይክፈሉ
                          </Button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 bg-green-950/30 border border-green-600/30 rounded-lg p-4">
                          <p className="text-sm text-green-200 font-semibold mb-2">
                            📱 የክፍያ መመሪያዎች / Payment Instructions:
                          </p>
                          <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Open your Telebirr app / የቴሌ ብር መተግበሪያን ይክፈቱ</li>
                            <li>Select "Send Money" / "ገንዘብ ላክ" ይምረጡ</li>
                            <li>Enter the account number above / ከላይ ያለውን ቁጥር ያስገቡ</li>
                            <li>Enter your deposit amount / የሚያስገቡትን መጠን ያስገቡ</li>
                            <li>
                              Confirm & send / ያረጋግጡ እና ይላኩ (Funds credited instantly!)
                            </li>
                          </ol>
                        </div>
                      </div>
                    </TabsContent>

                    {/* CBE Birr Tab */}
                    <TabsContent value="cbebirr" className="space-y-4 mt-6">
                      <div className="bg-gradient-to-br from-blue-950 to-blue-900 border border-blue-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-500 rounded-full p-3">
                            <Smartphone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">
                              CBE Birr (ሲቢኢ ብር)
                            </h4>
                            <p className="text-sm text-blue-300">
                              የኢትዮጵያ ንግድ ባንክ / Commercial Bank of Ethiopia
                            </p>
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                          <Label className="text-gray-300 mb-2 block">
                            የእናት ቤት CBE Birr መለያ / Enat Bet CBE Birr Account
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value="+251 912 345 678"
                              readOnly
                              className="bg-gray-800 border-blue-500/50 text-white font-mono text-lg"
                            />
                            <Button
                              onClick={() =>
                                copyToClipboard('+251912345678', 'CBE Birr Account')
                              }
                              className="bg-blue-600 hover:bg-blue-500"
                            >
                              {copiedAccount === 'CBE Birr Account' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Amount Selection */}
                        <Label className="text-gray-300 mb-2 block">
                          መጠን ይምረጡ / Select Amount
                        </Label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                            <Button
                              key={amount}
                              onClick={() => handleDeposit(amount, 'CBE Birr')}
                              className="bg-blue-700 hover:bg-blue-600 font-bold h-12"
                            >
                              {amount} ብር
                            </Button>
                          ))}
                        </div>

                        {/* Custom Amount */}
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="ሌላ መጠን / Custom amount"
                            className="bg-gray-800 border-blue-500/50"
                            id="cbebirr-custom"
                          />
                          <Button
                            onClick={() => {
                              const input = document.getElementById(
                                'cbebirr-custom'
                              ) as HTMLInputElement;
                              const amount = parseFloat(input.value);
                              if (amount > 0) handleDeposit(amount, 'CBE Birr');
                            }}
                            className="bg-blue-600 hover:bg-blue-500 px-8"
                          >
                            ይክፈሉ
                          </Button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 bg-blue-950/30 border border-blue-600/30 rounded-lg p-4">
                          <p className="text-sm text-blue-200 font-semibold mb-2">
                            📱 የክፍያ መመሪያዎች / Payment Instructions:
                          </p>
                          <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Open CBE Birr Mobile app / CBE Birr መተግበሪያን ይክፈቱ</li>
                            <li>Select "Send Money" / "ገንዘብ ላክ" ይምረጡ</li>
                            <li>Enter the account number above / ከላይ ያለውን ቁጥር ያስገቡ</li>
                            <li>Enter your deposit amount / የሚያስገቡትን መጠን ያስገቡ</li>
                            <li>
                              Confirm & send / ያረጋግጡ እና ይላኩ (Instant credit!)
                            </li>
                          </ol>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Bank Transfer Tab */}
                    <TabsContent value="bank" className="space-y-4 mt-6">
                      <div className="bg-gradient-to-br from-purple-950 to-purple-900 border border-purple-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-purple-500 rounded-full p-3">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">
                              Bank Transfer (ባንክ ትራንስፈር)
                            </h4>
                            <p className="text-sm text-purple-300">
                              ከማንኛውም ባንክ ወደ እናት ቤት / From any bank to Enat Bet
                            </p>
                          </div>
                        </div>

                        {/* Bank Account Details */}
                        <div className="space-y-3 mb-4">
                          <div className="bg-gray-900/50 rounded-lg p-4">
                            <Label className="text-gray-400 text-xs mb-1 block">
                              ባንክ ስም / Bank Name
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value="Commercial Bank of Ethiopia (CBE)"
                                readOnly
                                className="bg-gray-800 border-purple-500/50 text-white font-semibold"
                              />
                              <Button
                                onClick={() =>
                                  copyToClipboard('Commercial Bank of Ethiopia', 'Bank Name')
                                }
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-500"
                              >
                                {copiedAccount === 'Bank Name' ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gray-900/50 rounded-lg p-4">
                            <Label className="text-gray-400 text-xs mb-1 block">
                              መለያ ቁጥር / Account Number
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value="1000123456789"
                                readOnly
                                className="bg-gray-800 border-purple-500/50 text-white font-mono text-lg"
                              />
                              <Button
                                onClick={() =>
                                  copyToClipboard('1000123456789', 'Account Number')
                                }
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-500"
                              >
                                {copiedAccount === 'Account Number' ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gray-900/50 rounded-lg p-4">
                            <Label className="text-gray-400 text-xs mb-1 block">
                              የመለያ ስም / Account Name
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value="ENAT BET GAMING PLC"
                                readOnly
                                className="bg-gray-800 border-purple-500/50 text-white font-semibold"
                              />
                              <Button
                                onClick={() =>
                                  copyToClipboard('ENAT BET GAMING PLC', 'Account Name')
                                }
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-500"
                              >
                                {copiedAccount === 'Account Name' ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Amount Selection */}
                        <Label className="text-gray-300 mb-2 block">
                          መጠን ይምረጡ / Select Amount
                        </Label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                            <Button
                              key={amount}
                              onClick={() => handleDeposit(amount, 'Bank Transfer')}
                              className="bg-purple-700 hover:bg-purple-600 font-bold h-12"
                            >
                              {amount} ብር
                            </Button>
                          ))}
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 bg-purple-950/30 border border-purple-600/30 rounded-lg p-4">
                          <p className="text-sm text-purple-200 font-semibold mb-2">
                            🏦 የባንክ ትራንስፈር መመሪያዎች / Bank Transfer Instructions:
                          </p>
                          <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Visit your bank or use mobile banking / ባንክዎን ይጎብኙ</li>
                            <li>
                              Select "Transfer" or "Send Money" / "ትራንስፈር" ይምረጡ
                            </li>
                            <li>Use the account details above / ከላይ ያሉትን ዝርዝሮች ይጠቀሙ</li>
                            <li>Include your phone number in remarks / ስልክ ቁጥርዎን ይጨምሩ</li>
                            <li>
                              Wait 5-30 minutes for confirmation / 5-30 ደቂቃ ይጠብቁ
                            </li>
                          </ol>
                          <p className="text-xs text-yellow-300 mt-2 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>
                              Processing time: 5-30 minutes / የማቀናበሪያ ጊዜ: 5-30 ደቂቃ
                            </span>
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Crypto Tab */}
                    <TabsContent value="crypto" className="space-y-4 mt-6">
                      <div className="bg-gradient-to-br from-orange-950 to-yellow-950 border border-orange-500/50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-orange-500 rounded-full p-3">
                            <Bitcoin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">
                              Crypto (ክሪፕቶ)
                            </h4>
                            <p className="text-sm text-orange-300">
                              Bitcoin, Ethereum, USDT & more
                            </p>
                          </div>
                        </div>

                        {/* Crypto Options */}
                        <Label className="text-gray-300 mb-3 block">
                          ክሪፕቶ ይምረጡ / Select Cryptocurrency
                        </Label>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { name: 'Bitcoin (BTC)', rate: '3,200,000', color: 'orange' },
                            { name: 'Ethereum (ETH)', rate: '185,000', color: 'blue' },
                            { name: 'USDT (TRC20)', rate: '125', color: 'green' },
                            { name: 'USDC', rate: '125', color: 'blue' },
                          ].map((crypto) => (
                            <button
                              key={crypto.name}
                              onClick={() => {
                                toast.info(
                                  `${crypto.name} ተመርጧል / Selected ${crypto.name}`,
                                  { icon: '₿' }
                                );
                                setTimeout(() => handleDeposit(1000, crypto.name), 2000);
                              }}
                              className={`bg-gray-800 hover:bg-gray-700 border-2 border-${crypto.color}-500/50 rounded-lg p-4 text-left transition-all hover:border-${crypto.color}-500`}
                            >
                              <div className="font-bold text-white mb-1">
                                {crypto.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                1 = {crypto.rate} ብር
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Wallet Address */}
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                          <Label className="text-gray-300 mb-2 block">
                            የእናት ቤት Crypto Wallet / Enat Bet Crypto Wallet Address
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                              readOnly
                              className="bg-gray-800 border-orange-500/50 text-white font-mono text-sm"
                            />
                            <Button
                              onClick={() =>
                                copyToClipboard(
                                  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                                  'Wallet Address'
                                )
                              }
                              className="bg-orange-600 hover:bg-orange-500"
                            >
                              {copiedAccount === 'Wallet Address' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Exchange Rates */}
                        <div className="bg-orange-950/30 border border-orange-600/30 rounded-lg p-4 mb-4">
                          <p className="text-sm text-orange-200 font-semibold mb-2">
                            💱 የዛሬው ተመን / Today's Exchange Rates:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                            <div>1 BTC = 3,200,000 ብር</div>
                            <div>1 ETH = 185,000 ብር</div>
                            <div>1 USDT = 125 ብር</div>
                            <div>1 USDC = 125 ብር</div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-orange-950/30 border border-orange-600/30 rounded-lg p-4">
                          <p className="text-sm text-orange-200 font-semibold mb-2">
                            ₿ የክሪፕቶ ክፍያ መመሪያዎች / Crypto Payment Instructions:
                          </p>
                          <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Select your cryptocurrency / ክሪፕቶዎን ይምረጡ</li>
                            <li>Copy the wallet address above / Wallet address ይገልብጡ</li>
                            <li>
                              Send from your wallet / ከእርስዎ wallet ይላኩ
                            </li>
                            <li>Wait for blockchain confirmation / Confirmation ይጠብቁ</li>
                            <li>
                              Funds credited automatically! / ገንዘብ በራስ-ሰር ይገባል!
                            </li>
                          </ol>
                          <p className="text-xs text-green-300 mt-2 flex items-center gap-1">
                            <span>⚡</span>
                            <span>
                              Instant deposits with automatic Birr conversion!
                            </span>
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Support Section */}
                <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-300 text-center">
                    💬 ጥያቄ አለዎት? / Need Help? Contact Support: +251 911 000 000 (24/7)
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Logout */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-700 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Crash Games Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-yellow-400" />
            የማባረሪያ ጨዋታዎች / Crash Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAMES.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div
                    className={`relative bg-gradient-to-br ${game.color} rounded-2xl p-8 overflow-hidden shadow-2xl`}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-black/50" />
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            opacity: [0.2, 1, 0.2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>

                    <div className="relative z-10">
                      <Icon className="w-16 h-16 mb-4 text-white drop-shadow-lg" />
                      <h3 className="text-3xl font-black text-white mb-2">
                        {game.name}
                      </h3>
                      <p className="text-xl font-bold text-white/80 mb-4">
                        {game.nameAmharic}
                      </p>
                      <p className="text-sm text-white/70">{game.description}</p>
                      <p className="text-xs text-white/60">{game.descAmharic}</p>

                      <Button className="w-full mt-6 bg-white text-black hover:bg-gray-100 font-bold">
                        ይጫወቱ / PLAY NOW
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Fruit Games Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cherry className="w-6 h-6 text-pink-400" />
            የፍራፍሬ ጨዋታዎች / Fruit Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FRUIT_GAMES.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <div
                    className={`relative bg-gradient-to-br ${game.color} rounded-2xl p-8 overflow-hidden shadow-2xl`}
                  >
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative z-10 text-center">
                      <Icon className="w-16 h-16 mb-4 mx-auto text-white drop-shadow-lg" />
                      <h3 className="text-2xl font-black text-white mb-2">
                        {game.name}
                      </h3>
                      <p className="text-lg font-bold text-white/80 mb-4">
                        {game.nameAmharic}
                      </p>

                      <Button
                        className="w-full bg-white text-black hover:bg-gray-100 font-bold"
                        onClick={() =>
                          toast.info('በቅርቡ ይመጣል / Coming soon!', {
                            icon: '🎰',
                          })
                        }
                      >
                        በቅርቡ / COMING SOON
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Responsible Gaming Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>
            ⚠️ 18+ ብቻ | አደገኛ ሊሆን ይችላል። ኃላፊነት ባለው መንገድ ይጫወቱ | Gambling can be
            addictive. Play responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}
