"use client";

import { useState, useEffect } from 'react';
import { Save, User, Key, UserPlus, Edit, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {  getAdmins, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin,
  changeAdminPassword,
 } from '@/lib/api/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export interface Admin {
    id: string;
    email: string;
    username: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
}

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
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [createAdminData, setCreateAdminData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [editAdminData, setEditAdminData] = useState({
    username: '',
    email: '',
    role: '',
    isActive: true,
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [editAdminLoading, setEditAdminLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  // Fetch all admins (you'll need to implement this endpoint)
  const fetchAdmins = async () => {
    if (!token) return;
    
    try {
      setAdminsLoading(true);
      // Since there's no GET /admins endpoint, you might need to implement one
      // For now, this is a placeholder - you'll need to adjust based on your API
      console.log(token)
      const response = await getAdmins(token)
      console.log(response)
      
      if (response) {
        setAdmins(response || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    } finally {
      setAdminsLoading(false);
    }
  };

  

  // Create new admin
   const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setCreateAdminLoading(true);
      await createAdmin(token, createAdminData);
      toast.success('Admin created successfully');
      setCreateDialogOpen(false);
      setCreateAdminData({ username: '', email: '', password: '' });
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create admin');
    } finally {
      setCreateAdminLoading(false);
    }
  };

  // Update admin
   const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedAdmin) return;

    try {
      setEditAdminLoading(true);
      await updateAdmin(token, selectedAdmin.id, editAdminData);
      toast.success('Admin updated successfully');
      setEditDialogOpen(false);
      setSelectedAdmin(null);
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update admin');
    } finally {
      setEditAdminLoading(false);
    }
  };
  // Delete admin
  const handleDeleteAdmin = async (adminId: string) => {
    if (!token) return;

    try {
      await deleteAdmin(token, adminId);
      toast.success('Admin deleted successfully');
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete admin');
    }
  };

  const openEditDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditAdminData({
      username: admin.username,
      email: admin.email,
      role: admin.role ?? '',
      isActive: admin.isActive ?? true,
    });
    setEditDialogOpen(true);
  };

  useEffect(() => {
    fetchAdmins();
  }, [token]);

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
    if (!token || !adminData?.id) return;

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await changeAdminPassword(token, adminData.id, passwordFormData);
      toast.success('Password changed successfully');
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
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
          <TabsTrigger value="manage-admins">
            <Shield className="mr-2 w-4 h-4" />
            Manage Admins
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
          View your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profileFormData.username}
              readOnly
              disabled
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileFormData.email}
              readOnly
              disabled
            />
          </div>
              </div>
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
                <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordFormData.currentPassword}
                  onChange={(e) => setPasswordFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  className="top-1/2 right-2 absolute text-muted-foreground -translate-y-1/2"
                  tabIndex={-1}
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                </div>
              </div>
              
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordFormData.newPassword}
                  onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  required
                  />
                  <button
                  type="button"
                  className="top-1/2 right-2 absolute text-muted-foreground -translate-y-1/2"
                  tabIndex={-1}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                </div>
                <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordFormData.confirmPassword}
                  onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                  />
                  <button
                  type="button"
                  className="top-1/2 right-2 absolute text-muted-foreground -translate-y-1/2"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
        
        <TabsContent value="manage-admins">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Manage Admins</CardTitle>
                <CardDescription>
                  Create, edit, and manage administrator accounts
                </CardDescription>
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 w-4 h-4" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Admin</DialogTitle>
                    <DialogDescription>
                      Add a new administrator to the system
                    </DialogDescription>
                  </DialogHeader>
                    <form onSubmit={handleCreateAdmin}>
                    <div className="space-y-4 py-4">
                      <div>
                      <Label htmlFor="create-username">Username</Label>
                      <Input
                        id="create-username"
                        value={createAdminData.username}
                        onChange={(e) => setCreateAdminData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        required
                      />
                      </div>
                      <div>
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={createAdminData.email}
                        onChange={(e) => setCreateAdminData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                        required
                      />
                      </div>
                      <div>
                        <Label htmlFor="create-password">Password</Label>
                        <Input
                          id="create-password"
                          type="password"
                          value={createAdminData.password}
                          onChange={(e) => setCreateAdminData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createAdminLoading}>
                        {createAdminLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                            Creating...
                          </div>
                        ) : (
                          'Create Admin'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {adminsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="border-2 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading admins...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {admins.length === 0 ? (
                    <p className="py-8 text-muted-foreground text-center">
                      No admins found
                    </p>
                  ) : (
                    admins.map((admin) => (
                      <div key={admin.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{admin.username}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              admin.isActive 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">{admin.email}</p>
                          <p className="text-muted-foreground text-sm">Role: {admin.role}</p>
                          <p className="text-muted-foreground text-sm">
                            Created: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(admin)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button> */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Admin</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete admin "{admin.username}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Admin Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Admin</DialogTitle>
                <DialogDescription>
                  Update administrator information
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditAdmin}>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-username">Username</Label>
                    <Input
                      id="edit-username"
                      value={editAdminData.username}
                      onChange={(e) => setEditAdminData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editAdminData.email}
                      onChange={(e) => setEditAdminData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-role">Role</Label>
                    <Input
                      id="edit-role"
                      value={editAdminData.role}
                      onChange={(e) => setEditAdminData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Enter role"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-active"
                      checked={editAdminData.isActive}
                      onCheckedChange={(checked) => setEditAdminData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="edit-active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={editAdminLoading}>
                    {editAdminLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      'Update Admin'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}