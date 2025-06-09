import PageLayout from '../../components/PageLayout';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Deal {
  _id: string;
  title: string;
  image?: string;
  price?: number;
  discount?: number;
  merchant?: { businessName?: string } | string;
}

const UserDashboard = () => {
  const [claimed, setClaimed] = useState<Deal[]>([]);
  const [favorited, setFavorited] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [claimedRes, favoritedRes] = await Promise.all([
          api.get<{ deals: Deal[] }>(`/users/me/claimed`).catch(e => (e.response?.status === 404 ? { data: { deals: [] as Deal[] } } : Promise.reject(e))),
          api.get<{ deals: Deal[] }>(`/users/me/favorited`).catch(e => (e.response?.status === 404 ? { data: { deals: [] as Deal[] } } : Promise.reject(e))),
        ]);
        const mapMerchant = (deal: Deal) => ({
          ...deal,
          merchant: typeof deal.merchant === 'string' ? { businessName: deal.merchant } : deal.merchant,
        });
        setClaimed((claimedRes.data.deals || []).map(mapMerchant));
        setFavorited((favoritedRes.data.deals || []).map(mapMerchant));
      } catch {
        setClaimed([]);
        setFavorited([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <PageLayout title="My Dashboard">
      {loading && <div>Loading...</div>}
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-3">Claimed Deals</h3>
            <div className="row g-4">
              {claimed.length === 0 && <div className="text-muted">No claimed deals.</div>}
              {claimed.map(deal => (
                <div key={deal._id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="d-flex align-items-center" style={{ minHeight: 120 }}>
                      <img
                        src={deal.image || '/placeholder.png'}
                        alt={deal.title}
                        className="w-25 rounded-start"
                        style={{ objectFit: 'cover', minHeight: 100, maxHeight: 120, background: '#e9ecef', paddingLeft: 10 }}
                      />
                      <div className="flex-grow-1 p-3">
                        <h5 className="mb-1">{deal.title}</h5>
                        <div className="mb-1"><strong>Price:</strong> <span className="badge bg-success">${deal.price}</span></div>
                        <div className="mb-1"><strong>Discount:</strong> <span className="badge bg-warning text-dark">{deal.discount}%</span></div>
                        <div className="mb-1"><strong>Merchant:</strong> <span className="text-secondary">{typeof deal.merchant === 'string' ? deal.merchant : deal.merchant?.businessName}</span></div>
                        <button
                          className="btn btn-outline-primary btn-sm mt-2 px-3 rounded-pill fw-bold"
                          onClick={() => navigate(`/deals/${deal._id}`)}
                        >
                          Preview Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h3 className="mb-3">Favorited Deals</h3>
            <div className="row g-4">
              {favorited.length === 0 && <div className="text-muted">No favorited deals.</div>}
              {favorited.map(deal => (
                <div key={deal._id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="d-flex align-items-center" style={{ minHeight: 120 }}>
                      <img
                        src={deal.image || '/placeholder.png'}
                        alt={deal.title}
                        className="w-25 rounded-start"
                        style={{ objectFit: 'cover', minHeight: 100, maxHeight: 120, background: '#e9ecef', paddingLeft: 10 }}
                      />
                      <div className="flex-grow-1 p-3">
                        <h5 className="mb-1">{deal.title}</h5>
                        <div className="mb-1"><strong>Price:</strong> <span className="badge bg-success">${deal.price}</span></div>
                        <div className="mb-1"><strong>Discount:</strong> <span className="badge bg-warning text-dark">{deal.discount}%</span></div>
                        <div className="mb-1"><strong>Merchant:</strong> <span className="text-secondary">{typeof deal.merchant === 'string' ? deal.merchant : deal.merchant?.businessName}</span></div>
                        <button
                          className="btn btn-outline-primary btn-sm mt-2 px-3 rounded-pill fw-bold"
                          onClick={() => navigate(`/deals/${deal._id}`)}
                        >
                          Preview Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserDashboard;
