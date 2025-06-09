import { useState } from 'react';
import { toast } from 'react-toastify';
import PageLayout from '../../components/PageLayout';
import adminService from '../../services/adminService';

const Admin = () => {
  const [section, setSection] = useState<'users' | 'merchants' | 'deals' | null>(null);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  const handleManage = async (type: 'users' | 'merchants' | 'deals') => {
    setSection(type);
    setLoading(true);
    try {
      if (type === 'users') setData(await adminService.fetchUsers());
      if (type === 'merchants') setData(await adminService.fetchMerchants());
      if (type === 'deals') setData(await adminService.fetchDeals());
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

  // Helper to cast item to expected type
  const get = <T,>(obj: Record<string, unknown>, key: string, fallback: T): T => {
    return (obj[key] as T) ?? fallback;
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
                    <tr key={get<string>(item, '_id', '')}>
                      {section === 'users' && <>
                        <td>{get<string>(item, 'email', '-')}</td>
                        <td>{get<boolean>(item, 'isBanned', false) ? 'Yes' : 'No'}</td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleBan(get<string>(item, '_id', ''))}>{get<boolean>(item, 'isBanned', false) ? 'Unban' : 'Ban'}</button>
                        </td>
                      </>}
                      {section === 'merchants' && <>
                        <td>{get<string>(item, 'email', '-')}</td>
                        <td>{get<string>(item, 'businessName', '-')}</td>
                        <td>{get<boolean>(item, 'isBanned', false) ? 'Yes' : 'No'}</td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleBan(get<string>(item, '_id', ''))}>{get<boolean>(item, 'isBanned', false) ? 'Unban' : 'Ban'}</button>
                        </td>
                      </>}
                      {section === 'deals' && <>
                        <td>{get<string>(item, 'title', '-')}</td>
                        <td>{get<string>(item, 'status', '-')}</td>
                        <td>{typeof item.merchant === 'object' && item.merchant ? (get<string>(item.merchant as Record<string, unknown>, 'businessName', get<string>(item.merchant as Record<string, unknown>, 'email', '-'))) : '-'}</td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleModerate(get<string>(item, '_id', ''), get<string>(item, 'status', ''))}>{get<string>(item, 'status', '') === 'published' ? 'Unpublish' : 'Publish'}</button>
                        </td>
                      </>}
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
