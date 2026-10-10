import { Settings as SettingsIcon, Building2, Database, Info, HelpCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-full bg-background p-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center">
          <SettingsIcon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your warehouse system</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">
        {/* User Profile */}
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-info-soft rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-info" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-1 text-foreground">User Profile</h3>
              <p className="text-muted-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground/70">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-1 text-foreground">Facility Location</h3>
              <p className="text-muted-foreground">North-East Logistics Hub</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-1 text-foreground">Storage Strategy</h3>
              <p className="text-muted-foreground">Local Database (Offline-First)</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-1 text-foreground">App Version</h3>
              <p className="text-muted-foreground">WarehouseFlow v1.0.0</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-1 text-foreground">Quick Help</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5 mt-2">
                <li>• Use the + button to add new items</li>
                <li>• Tap Add/Remove Stock to adjust quantities</li>
                <li>• View analytics in the Statistics tab</li>
                <li>• Items below minimum stock show low alerts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full h-12 text-base"
          size="lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 WarehouseFlow
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          International Logistics Solutions
        </p>
      </div>
    </div>
  );
}