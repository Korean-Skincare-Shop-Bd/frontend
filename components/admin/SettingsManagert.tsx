"use client";

import { useState } from 'react';
import { Save, User, Key, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export function SettingsManager() {
  const { adminData, token } = useAdmin();
  const [profileFormData, setProfileFormData] = useState({
    username: adminData?.username || '',
    email: adminData?.email || '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setProfileLoading(true);
      // Add API call to update admin profile when available
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      // Add API call to change password when available
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success('Password changed successfully');
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and security preferences
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">
            <User className="mr-2 w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password">
            <Key className="mr-2 w-4 h-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileFormData.username}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordFormData.newPassword}
                      onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordFormData.confirmPassword}
                      onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                      Changing...
                    </div>
                  ) : (
                    <>
                      <Key className="mr-2 w-4 h-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Admin Permissions</CardTitle>
              <CardDescription>
                View your account permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground text-center">
                    You have full administrator access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}