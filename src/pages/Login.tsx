import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (v: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(v);

  // Dynamic error messages
  const emailError =
    touched.email && !email
      ? 'Email is required'
      : touched.email && !validateEmail(email)
      ? 'Invalid email format'
      : '';

  const passwordError =
    touched.password && !password ? 'Password is required' : '';

  const formValid = email && password && !emailError && !passwordError;

  const handleLogin = async () => {
    // Blur validation prevents clicking
    if (!formValid) return;

    setLoading(true);

    const form = new FormData();
    form.append('email', email);
    form.append('password', password);

    try {
      const res = await fetch('http://13.210.33.250/api/login', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      console.log('Login Response:', data);

      // INVALID CREDENTIALS
      if (!res.ok || data.status === false) {
        toast.error(data.message || 'Invalid credentials');

        setLoading(false); // 🔥 VERY IMPORTANT
        return;
      }

      // SUCCESS
      toast.success('Login successful');
      localStorage.setItem('token', data.access_token);
  // SAVE COMPANY ID (from companies array)
    if (data.companies && data.companies.length > 0) {
      localStorage.setItem("companyId", data.companies[0].id);
    }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Server unreachable');
      console.log(error);
      setLoading(false); // 🔥 Reset on server crash
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col items-center justify-center bg-black">
      <div className="absolute inset-0 bg-[url('/login.gif')] bg-cover bg-center opacity-80"></div>

      <div className="relative z-10 mb-12">
        <h1 className="text-4xl font-bold text-white tracking-widest">LOGO</h1>
      </div>

      <div className="relative z-10 w-[380px] p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-4">Sign in</h2>
        <p className="text-gray-300 mb-6">Log in to manage your account</p>

        {/* Email */}
        <div className="flex justify-between items-center">
          <label className="text-gray-200 text-sm">Email</label>
          <div className="h-2">
            {emailError && (
              <p className="text-red-400 text-right text-[12px]">
                {emailError}
              </p>
            )}
          </div>
        </div>

        <div className="relative mt-1">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            size={18}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full bg-white/20 text-white pl-10 pr-4 py-2 rounded-lg outline-none border 
              ${emailError ? 'border-red-400' : 'border-white/30'}
            `}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
          />
        </div>

        {/* Reserve fixed height → No jerking */}

        <div className="flex justify-between items-center mt-2">
          <label className="text-gray-200 text-sm mt-2  block">Password</label>
          {/* Reserve space */}
          <div className="h-2">
            {passwordError && (
              <p className="text-red-400 text-right text-[12px]">
                {passwordError}
              </p>
            )}
          </div>
        </div>
        {/* Password */}
        <div className="relative mt-1">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            size={18}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full bg-white/20 text-white pl-10 pr-4 py-2 rounded-lg outline-none border 
              ${passwordError ? 'border-red-400' : 'border-white/30'}
            `}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
          />
        </div>

        {/* Remember + Forgot Password */}
        <div className="flex justify-between items-center mt-2">
          <label className="flex items-center text-gray-200 text-sm space-x-2">
            <input type="checkbox" className="accent-[#593CFF]" />
            <span>Remember me</span>
          </label>

          <button className="text-sm text-purple-300 hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!formValid || loading}
          className={`w-full mt-6 py-2 rounded-lg text-white font-medium transition 
            ${formValid ? 'bg-[#593CFF]' : 'bg-purple-400 cursor-not-allowed'}
          `}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
