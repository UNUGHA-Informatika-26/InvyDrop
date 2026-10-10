import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { HeroBanner } from './HeroBanner';
import loginBg from '@/assets/bulan-jatuh4.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="app-shell">
      <div className="app-content flex flex-col">
        {/* Header Image */}
        <HeroBanner
          imageSrc={loginBg}
          title="InvyDrop"
          subtitle="North-East Logistics Hub"
          className="h-56 rounded-b-3xl flex-shrink-0"
          contentClassName="justify-center px-6"
        />

        {/* Login Form */}
        <div className="flex-1 px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access your inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-base">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@company.com"
                className="mt-2 h-12 text-base"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="mt-2 h-12 text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover h-12 text-base"
              disabled={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}