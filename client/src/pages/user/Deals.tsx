import { api } from '../../services/api';
import { toast } from 'react-toastify';
import PageLayout from '../../components/PageLayout';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { fetchDeals } from '../../services/dealService';
import { useSearchParams, useNavigate } from 'react-router-dom';


interface Deal {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  discount?: number;
  terms?: string;
  expiry?: string;
  image?: string;
  status?: string;
  merchant?: { businessName?: string };
  favorited?: boolean;
  claimed?: boolean;
}

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const category = searchParams.get('category') || undefined;
  const [actionLoading, setActionLoading] = useState<{ [id: string]: { claim?: boolean; favorite?: boolean } }>({});

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let claimedIds = new Set<string>();
        let favoritedIds = new Set<string>();
        const dealsRes = await fetchDeals(category);
        if (user?.role === 'user') {
          const [claimedRes, favoritedRes] = await Promise.all([
            api.get<{ deals: Deal[] }>(`/users/me/claimed`).catch(e => (e.response?.status === 404 ? { data: { deals: [] as Deal[] } } : Promise.reject(e))),
            api.get<{ deals: Deal[] }>(`/users/me/favorited`).catch(e => (e.response?.status === 404 ? { data: { deals: [] as Deal[] } } : Promise.reject(e))),
          ]);
          claimedIds = new Set(claimedRes.data.deals.map((d) => d._id));
          favoritedIds = new Set(favoritedRes.data.deals.map((d) => d._id));
        }
        setDeals(
          dealsRes.map((deal) => ({
            ...deal,
            merchant: typeof deal.merchant === 'string' ? { businessName: deal.merchant } : deal.merchant,
            claimed: claimedIds.has(deal._id),
            favorited: favoritedIds.has(deal._id),
          }))
        );
        setError(null);
      } catch {
        setError('Failed to load deals.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, user]);

  return (
    <PageLayout title={category ? `${category} Deals` : 'All Deals'}>
      {loading && <div>Loading deals...</div>}
      {error && <div className="text-danger">{error}</div>}
      <div className="row g-4">
        {deals.map((deal) => (
          <div key={deal._id} className="col-12 mb-4">
            <div className="card flex-row shadow-sm border-0 bg-white h-100 align-items-center" style={{ minHeight: 180 }}>
              <div className="col-4 p-0 d-flex align-items-center justify-content-center">
                {deal.image ? (
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-100 h-100 rounded-start"
                    style={{ objectFit: 'cover', minHeight: 180, maxHeight: 220 }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted" style={{ fontSize: 32, minHeight: 180, maxHeight: 220, background: '#e9ecef', borderRadius: '0.5rem 0 0 0.5rem' }}>
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="col-8 p-3 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="mb-1">{deal.title}</h5>
                  <p className="text-muted mb-2" style={{ minHeight: 40 }}>{deal.description}</p>
                  <div className="mb-1"><strong>Price:</strong> <span className="badge bg-success">${deal.price}</span></div>
                  <div className="mb-1"><strong>Discount:</strong> <span className="badge bg-warning text-dark">{deal.discount}%</span></div>
                  <div className="mb-1"><strong>Merchant:</strong> <span className="text-secondary">{typeof deal.merchant === 'string' ? deal.merchant : deal.merchant?.businessName}</span></div>
                </div>
                <div className="text-end d-flex gap-2 justify-content-end align-items-center">
                  <button
                    className={`btn btn-outline-success px-3 py-1 fw-bold rounded-pill${deal.claimed ? ' active' : ''}`}
                    title={deal.claimed ? 'Unclaim this deal' : 'Claim this deal'}
                    disabled={!!actionLoading[deal._id]?.claim}
                    onClick={async () => {
                      if (actionLoading[deal._id]?.claim) return;
                      setActionLoading((prev) => ({ ...prev, [deal._id]: { ...prev[deal._id], claim: true } }));
                      try {
                        if (deal.claimed) {
                          await api.delete(`/deals/${deal._id}/claim`);
                          toast.info('Deal unclaimed');
                          setDeals((prev) => prev.map((d) => d._id === deal._id ? { ...d, claimed: false } : d));
                        } else {
                          await api.post(`/deals/${deal._id}/claim`);
                          toast.success('Deal claimed!');
                          setDeals((prev) => prev.map((d) => d._id === deal._id ? { ...d, claimed: true } : d));
                        }
                      } catch (err) {
                        const error = err as { response?: { status?: number } };
                        if (error.response?.status === 409) {
                          toast.info('Already claimed');
                          setDeals((prev) => prev.map((d) => d._id === deal._id ? { ...d, claimed: true } : d));
                        } else {
                          toast.error('Failed to update claim status');
                        }
                      } finally {
                        setActionLoading((prev) => ({ ...prev, [deal._id]: { ...prev[deal._id], claim: false } }));
                      }
                    }}
                  >
                    {actionLoading[deal._id]?.claim ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {deal.claimed ? 'Unclaim' : 'Claim'}
                  </button>
                  <button
                    className={`btn btn-outline-warning px-3 py-1 fw-bold rounded-pill${deal.favorited ? ' active' : ''}`}
                    title={deal.favorited ? 'Remove from favorites' : 'Add to favorites'}
                    disabled={!!actionLoading[deal._id]?.favorite}
                    onClick={async () => {
                      if (actionLoading[deal._id]?.favorite) return;
                      setActionLoading((prev) => ({ ...prev, [deal._id]: { ...prev[deal._id], favorite: true } }));
                      try {
                        if (deal.favorited) {
                          await api.delete(`/deals/${deal._id}/favorite`);
                          toast.info('Removed from favorites');
                        } else {
                          await api.post(`/deals/${deal._id}/favorite`);
                          toast.success('Deal favorited!');
                        }
                        setDeals((prev) => prev.map((d) => d._id === deal._id ? { ...d, favorited: !deal.favorited } : d));
                      } catch (err) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const error = err as any;
                        if (error.response?.status === 409) {
                          toast.info('Already favorited');
                          setDeals((prev) => prev.map((d) => d._id === deal._id ? { ...d, favorited: true } : d));
                        } else if (error.response?.data?.message) {
                          toast.error(error.response.data.message);
                        } else {
                          toast.error('Failed to update favorite status');
                        }
                      } finally {
                        setActionLoading((prev) => ({ ...prev, [deal._id]: { ...prev[deal._id], favorite: false } }));
                      }
                    }}
                  >
                    {actionLoading[deal._id]?.favorite ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {deal.favorited ? 'Unfavorite' : 'Favorite'}
                  </button>
                  <button
                    className="btn btn-primary btn-lg px-5 py-2 shadow-sm fw-bold rounded-pill border-0"
                    style={{ letterSpacing: 1, fontSize: '1.1rem', boxShadow: '0 2px 12px #00999933' }}
                    onClick={() => navigate(`/deals/${deal._id}`)}
                  >
                    <span className="me-2">View Deal</span>
                    <i className="bi bi-arrow-right-circle"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && deals.length === 0 && <div className="text-center">No deals found.</div>}
      </div>
    </PageLayout>
  );
};

export default Deals;