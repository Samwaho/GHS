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
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="flex w-full min-w-max gap-2 py-1 pr-2 flex-nowrap sm:min-w-0 sm:flex-wrap sm:justify-center lg:flex-nowrap lg:justify-start">
            <TabsTrigger value="categories" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Categories
            </TabsTrigger>
            <TabsTrigger value="services" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Services
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Branches
            </TabsTrigger>
            <TabsTrigger value="branch-services" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Branch Services
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Bookings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Users
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Gallery
            </TabsTrigger>
            <TabsTrigger value="gift-vouchers" className="flex-none py-2 text-xs sm:flex-1 sm:text-sm">
            Gift Vouchers
            </TabsTrigger>
          </TabsList>
        </div>

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
