import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, Eye, EyeOff, Loader2, Globe, User } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import { socket } from '../utils/socket';

export function LoginScreen() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length < 9) {
      toast.error('እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ / Please enter a valid phone number');
      return;
    }

    if (password.length < 6) {
      toast.error('የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት / Password must be at least 6 characters');
      return;
    }

    if (!isLogin) {
      // Registration validation
      if (!fullName.trim()) {
        toast.error('እባክዎ ሙሉ ስምዎን ያስገቡ / Please enter your full name');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('የይለፍ ቃሎች አይዛመዱም / Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          password: password,
          name: isLogin ? undefined : fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_phone', data.user.phone);
      
      // Update socket auth and re-connect immediately
      socket.auth = { token: data.token };
      socket.disconnect().connect();
      
      toast.success(isLogin ? 'እንኳን ደህና መጡ! / Welcome back!' : 'መለያ በተሳካ ሁኔታ ተፈጥሯል! / Account created successfully!');
      
      // Delay slightly for toast visibility
      setTimeout(() => navigate('/lobby'), 1000);

    } catch (err: any) {
      toast.error(err.message || 'ሽግግሩ አልተሳካም። እባክዎ እንደገና ይሞክሩ / Connection failed. Please try again.');
      setLoading(false);
    }
  };
  
  const handleDevLogin = (targetPath: string = '/lobby') => {
    localStorage.setItem('user_phone', '900000000');
    localStorage.setItem('user_name', 'Developer');
    localStorage.setItem('user_registered', 'true');
    toast.success('Developer session started!');
    navigate(targetPath);
  };

  return (
    <div className="size-full bg-gradient-to-br from-green-950 via-yellow-950 to-red-950 flex items-center justify-center p-4 overflow-auto">
      <Toaster position="top-center" theme="dark" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 blur-2xl opacity-60" />
              <div className="relative bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                <h1 className="text-6xl font-black tracking-tight">እናት ቤት</h1>
                <h2 className="text-4xl font-black tracking-wide mt-2">
                  ENAT BET
                </h2>
              </div>
            </div>
          </motion.div>
          <p className="text-gray-300 text-sm">የኢትዮጵያ #1 የቁማር መድረክ</p>
          <p className="text-gray-400 text-xs mt-1">
            Ethiopia's #1 Gaming Platform
          </p>
        </div>

        {/* Login/Register card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 h-2" />

          {/* Tab switcher */}
          <div className="grid grid-cols-2 p-2 gap-2 bg-gray-950/50">
            <button
              onClick={() => setIsLogin(true)}
              className={`py-3 px-4 rounded-lg font-bold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              ይግቡ / LOGIN
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`py-3 px-4 rounded-lg font-bold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              ይመዝገቡ / REGISTER
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Full Name (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      ሙሉ ስም / Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="አበበ በቀለ / Abebe Bekele"
                      className="h-12 bg-gray-800 border-gray-700 text-white"
                      required={!isLogin}
                    />
                  </div>
                )}

                {/* Phone number input */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    ስልክ ቁጥር / Phone Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">+251</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="9XXXXXXXX"
                      className="pl-20 h-12 bg-gray-800 border-gray-700 text-white"
                      maxLength={9}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    ምሳሌ: 912345678 (without +251)
                  </p>
                </div>

                {/* Password input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    የይለፍ ቃል / Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-12 h-12 bg-gray-800 border-gray-700 text-white"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500">
                      ቢያንስ 6 ቁምፊዎች / Minimum 6 characters
                    </p>
                  )}
                </div>

                {/* Confirm Password (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-300 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      የይለፍ ቃል ያረጋግጡ / Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pr-12 h-12 bg-gray-800 border-gray-700 text-white"
                        minLength={6}
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 text-lg font-bold ${
                    isLogin
                      ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500'
                      : 'bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500'
                  } disabled:from-gray-700 disabled:to-gray-700`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isLogin ? 'በመግባት ላይ...' : 'በመመዝገብ ላይ...'}
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      {isLogin ? 'ይግቡ / LOGIN' : 'ይመዝገቡ / REGISTER'}
                    </>
                  )}
                </Button>

                {/* Forgot password (Login only) */}
                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() =>
                        toast.info('እባክዎ ድጋፍን ያነጋግሩ / Please contact support', {
                          icon: '📞',
                        })
                      }
                      className="text-sm text-gray-400 hover:text-gray-300 underline"
                    >
                      የይለፍ ቃል ረሱ? / Forgot Password?
                    </button>
                  </div>
                )}
              </motion.form>
            </AnimatePresence>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-green-400">24/7</div>
                  <div className="text-xs text-gray-400">ድጋፍ / Support</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-yellow-400">ብር</div>
                  <div className="text-xs text-gray-400">Ethiopian Birr</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400">₿</div>
                  <div className="text-xs text-gray-400">Crypto Deposit</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-red-400">🎰</div>
                  <div className="text-xs text-gray-400">Multiple Games</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Developer Mode */}
        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-gray-800" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Developer Phase Tools</span>
            <div className="h-[1px] w-8 bg-gray-800" />
          </div>
          <div className="grid grid-cols-2 gap-3">
             <Button 
               variant="outline" 
               size="sm"
               className="bg-white/5 border-white/10 text-white/60 hover:text-white"
               onClick={() => handleDevLogin()}
             >
                Developer Login
             </Button>
             <Button 
               variant="outline" 
               size="sm"
               className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
               onClick={() => handleDevLogin('/game/rocket')}
             >
                Quick Launch Rocket
             </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          18+ ብቻ | For Adults Only | ኃላፊነት ባለው መንገድ ይጫወቱ
        </p>
      </motion.div>
    </div>
  );
}
