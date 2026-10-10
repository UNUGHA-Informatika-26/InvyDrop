import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { HeroBanner } from './HeroBanner';
import signupBg from '@/assets/bulan-jatuh.png';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const success = await signup(formData.name, formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Email already exists');
    }
  };

  return (
    <div className="app-shell">
      <div className="app-content flex flex-col">
        {/* Header Image */}
        <HeroBanner
          imageSrc={signupBg}
          title="InvyDrop"
          subtitle="North-East Logistics Hub"
          className="h-56 rounded-b-3xl flex-shrink-0"
          contentClassName="justify-center px-6"
        />

        {/* Signup Form */}
        <div className="flex-1 px-6 py-6">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Create Account</h2>
            <p className="text-muted-foreground">Join the warehouse management team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Smith"
                className="mt-2 h-12 text-base"
              />
            </div>

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
                placeholder="At least 6 characters"
                className="mt-2 h-12 text-base"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Re-enter your password"
                className="mt-2 h-12 text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover h-12 text-base mt-6"
              disabled={isLoading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center pb-6">
            <p className="text-base text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}