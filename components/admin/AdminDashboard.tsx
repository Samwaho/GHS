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
import {
  Layers,
  Sparkles,
  Building,
  Workflow,
  CalendarDays,
  Users,
  Images,
  TicketPercent
} from 'lucide-react';

const adminTabs = [
  {
    value: 'categories',
    label: 'Categories',
    description: 'Curate how services are grouped and surfaced.',
    icon: Layers,
    component: <CategoriesManager />,
    title: 'Service Categories'
  },
  {
    value: 'services',
    label: 'Services',
    description: 'Create, edit, or archive treatments and experiences.',
    icon: Sparkles,
    component: <ServicesManager />,
    title: 'Services'
  },
  {
    value: 'branches',
    label: 'Branches',
    description: 'Manage spa locations, contacts, and hours.',
    icon: Building,
    component: <BranchesManager />,
    title: 'Spa Branches'
  },
  {
    value: 'branch-services',
    label: 'Branch Services',
    description: 'Map services to branches with local pricing.',
    icon: Workflow,
    component: <BranchServicesManager />,
    title: 'Branch Services'
  },
  {
    value: 'bookings',
    label: 'Bookings',
    description: 'Oversee appointments, statuses, and team notes.',
    icon: CalendarDays,
    component: <BookingsManager />,
    title: 'Bookings Management'
  },
  {
    value: 'users',
    label: 'Users',
    description: 'Update roles and keep member data accurate.',
    icon: Users,
    component: <UsersManager />,
    title: 'Users Management'
  },
  {
    value: 'gallery',
    label: 'Gallery',
    description: 'Refresh imagery that powers the public gallery.',
    icon: Images,
    component: <GalleryManager />,
    title: 'Gallery Management'
  },
  {
    value: 'gift-vouchers',
    label: 'Gift Vouchers',
    description: 'Launch campaigns and monitor voucher usage.',
    icon: TicketPercent,
    component: <GiftVouchersManager />,
    title: 'Gift Vouchers Management'
  }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="flex w-full min-w-max gap-2 py-1 pr-2 flex-nowrap sm:min-w-0 sm:flex-wrap sm:justify-center lg:flex-nowrap lg:justify-start">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 flex-none whitespace-nowrap py-2 text-xs sm:flex-1 sm:text-sm"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {adminTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.title}</CardTitle>
                <p className="text-sm text-gray-500">{tab.description}</p>
              </CardHeader>
              <CardContent>{tab.component}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
