import { useState } from 'react';
import { toast } from 'react-toastify';
import PageLayout from '../../components/PageLayout';
import adminService from '../../services/adminService';
import type { User } from '../../types/auth';
import type { Deal } from '../../services/dealService';

const Admin = () => {
  const [section, setSection] = useState<'users' | 'merchants' | 'deals' | null>(null);
  const [data, setData] = useState<User[] | Deal[]>([]);
  const [loading, setLoading] = useState(false);

  const handleManage = async (type: 'users' | 'merchants' | 'deals') => {
    setSection(type);
    setLoading(true);
    try {
      if (type === 'users' || type === 'merchants') {
        setData(await adminService.fetchUsers());
      }
      if (type === 'deals') {
        setData(await adminService.fetchDeals());
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id: string) => {
    try {
      if (section === 'users') {
        await adminService.banUser(id); // PATCH /api/admin/users/:id/ban
      }
      if (section === 'merchants') {
        await adminService.banMerchant(id); // PATCH /api/admin/merchants/:id/ban
      }
      toast.success('Status updated');
      handleManage(section!);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleModerate = async (id: string, status: string) => {
    try {
      await adminService.moderateDeal(id, status === 'published' ? 'draft' : 'published'); // PATCH /api/admin/deals/:id/moderate
      toast.success(status === 'published' ? 'Unpublished' : 'Published');
      handleManage('deals');
    } catch {
      toast.error('Failed to update deal status');
    }
  };

  return (
    <PageLayout title="Admin Dashboard">
      <div className="text-center">
        <h2>Administrator Panel</h2>
        <p>Manage users, merchants, and site content.</p>
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 h-100">
              <h4>Users</h4>
              <p>Manage user accounts and permissions</p>
              <button className="btn btn-light btn-sm" onClick={() => handleManage('users')}>Manage</button>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 h-100">
              <h4>Merchants</h4>
              <p>Approve and manage merchant accounts</p>
              <button className="btn btn-light btn-sm" onClick={() => handleManage('merchants')}>Manage</button>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 h-100">
              <h4>Deals</h4>
              <p>Review and manage all deals</p>
              <button className="btn btn-light btn-sm" onClick={() => handleManage('deals')}>Manage</button>
            </div>
          </div>
        </div>
        {section && (
          <div className="mt-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="table table-bordered bg-white text-dark">
                <thead>
                  <tr>
                    {section === 'users' && <><th>Email</th><th>Banned</th><th>Actions</th></>}
                    {section === 'merchants' && <><th>Email</th><th>Business</th><th>Banned</th><th>Actions</th></>}
                    {section === 'deals' && <><th>Title</th><th>Status</th><th>Merchant</th><th>Actions</th></>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={'_id' in item ? item._id : ''}>
                      {section === 'users' && (
                        <>
                          <td>{'email' in item ? item.email : '-'}</td>
                          <td>{'isBanned' in item && item.isBanned ? 'Yes' : 'No'}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleBan('' + ('_id' in item ? item._id : ''))}>{'isBanned' in item && item.isBanned ? 'Unban' : 'Ban'}</button>
                          </td>
                        </>
                      )}
                      {section === 'merchants' && (
                        <>
                          <td>{'email' in item ? item.email : '-'}</td>
                          <td>{'businessName' in item ? item.businessName : '-'}</td>
                          <td>{'isBanned' in item && item.isBanned ? 'Yes' : 'No'}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleBan('' + ('_id' in item ? item._id : ''))}>{'isBanned' in item && item.isBanned ? 'Unban' : 'Ban'}</button>
                          </td>
                        </>
                      )}
                      {section === 'deals' && (
                        <>
                          <td>{'title' in item ? item.title : '-'}</td>
                          <td>{'status' in item ? item.status : '-'}</td>
                          <td>{typeof (item as Deal).merchant === 'object' && (item as Deal).merchant ? ((item as Deal).merchant as { businessName?: string; email?: string }).businessName ?? ((item as Deal).merchant as { email?: string }).email ?? '-' : '-'}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleModerate('' + ('_id' in item ? item._id : ''), '' + ('status' in item ? item.status : ''))}>{'status' in item && item.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Admin;
