'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoriesManager from './CategoriesManager';
import ServicesManager from './ServicesManager';
import BranchesManager from './BranchesManager';
import BranchServicesManager from './BranchServicesManager';
import BookingsManager from './BookingsManager';
import UsersManager from './UsersManager';
import GalleryManager from './GalleryManager';
import GiftVouchersManager from './GiftVouchersManager';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your spa services, bookings, and more</p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="branch-services">Branch Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="gift-vouchers">Gift Vouchers</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoriesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <ServicesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches">
          <Card>
            <CardHeader>
              <CardTitle>Spa Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <BranchesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branch-services">
          <Card>
            <CardHeader>
              <CardTitle>Branch Services</CardTitle>
            </CardHeader>
            <CardContent>
              <BranchServicesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Management</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Management</CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gift-vouchers">
          <Card>
            <CardHeader>
              <CardTitle>Gift Vouchers Management</CardTitle>
            </CardHeader>
            <CardContent>
              <GiftVouchersManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}