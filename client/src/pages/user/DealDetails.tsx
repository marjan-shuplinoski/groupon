import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import PageLayout from '../../components/PageLayout';
import { useAuth } from '../../hooks/useAuth';

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

const DealDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let claimedIds = new Set<string>();
        let favoritedIds = new Set<string>();
        const dealRes = await api.get<{ deal: Deal }>(`/deals/${id}`);
        if (user?.role === 'user') {
          const [claimedRes, favoritedRes] = await Promise.all([
            api.get<{ deals: Deal[] }>(`/users/me/claimed`).catch(e => (e.response?.status === 404 ? { data: { deals: [] as Deal[] } } : Promise.reject(e))),
            api.get<{ deals: Deal[] }>(`/users/me/favorited`).catch(e => (e.response?.status === 404 ? { data: { deals: [] as Deal[] } } : Promise.reject(e))),
          ]);
          claimedIds = new Set(claimedRes.data.deals.map((d) => d._id));
          favoritedIds = new Set(favoritedRes.data.deals.map((d) => d._id));
        }
        const dealData = dealRes.data.deal;
        setDeal({
          ...dealData,
          claimed: claimedIds.has(dealData._id),
          favorited: favoritedIds.has(dealData._id),
        });
      } catch {
        setDeal(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleClaim = async () => {
    if (!deal) return;
    setClaiming(true);
    try {
      if (deal.claimed) {
        await api.delete(`/deals/${deal._id}/claim`);
        toast.info('Deal unclaimed');
        setDeal({ ...deal, claimed: false });
      } else {
        await api.post(`/deals/${deal._id}/claim`);
        toast.success('Deal claimed!');
        setDeal({ ...deal, claimed: true });
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      if (error.response?.status === 409) {
        toast.info('Already claimed');
        setDeal({ ...deal, claimed: true });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update claim status');
      }
    } finally {
      setClaiming(false);
    }
  };

  const handleFavorite = async () => {
    if (!deal) return;
    setFavoriting(true);
    try {
      if (deal.favorited) {
        await api.delete(`/deals/${deal._id}/favorite`);
        toast.info('Removed from favorites');
        setDeal({ ...deal, favorited: false });
      } else {
        await api.post(`/deals/${deal._id}/favorite`);
        toast.success('Deal favorited!');
        setDeal({ ...deal, favorited: true });
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      if (error.response?.status === 409) {
        toast.info('Already favorited');
        setDeal({ ...deal, favorited: true });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update favorite status');
      }
    } finally {
      setFavoriting(false);
    }
  };

  if (loading) return <PageLayout title="Deal Details"><div>Loading...</div></PageLayout>;
  if (!deal) return <PageLayout title="Deal Details"><div>Deal not found.</div></PageLayout>;

  return (
    <PageLayout title={deal.title}>
      <div className="container py-4" style={{ maxWidth: 800 }}>
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-4 d-flex align-items-center justify-content-center deal-image-col">
            {deal.image ? (
              <img
                src={deal.image}
                alt={deal.title}
                className="w-100 shadow rounded-4 border"
                style={{ maxHeight: 340, objectFit: 'cover', background: '#e9ecef' }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted" style={{ fontSize: 32, minHeight: 180, maxHeight: 220, background: '#e9ecef', borderRadius: '0.5rem 0 0 0.5rem' }}>
                <span>No Image</span>
              </div>
            )}
          </div>
          <div className="col-12 col-md-8">
            <h2 className="mb-2">{deal.title}</h2>
            <p className="text-muted mb-3">{deal.description}</p>
            <div className="mb-2"><strong>Price:</strong> <span className="badge bg-success fs-6">{deal.price ? `$${deal.price}` : '-'}</span></div>
            <div className="mb-2"><strong>Discount:</strong> <span className="badge bg-warning text-dark fs-6">{deal.discount ? `${deal.discount}%` : '-'}</span></div>
            <div className="mb-2"><strong>Terms:</strong> <span className="text-secondary">{deal.terms || '-'}</span></div>
            <div className="mb-2"><strong>Expiry:</strong> <span className="text-secondary">{deal.expiry ? new Date(deal.expiry).toLocaleDateString() : '-'}</span></div>
            <div className="mb-2"><strong>Status:</strong> <span className="badge bg-info text-dark">{deal.status}</span></div>
            <div className="mb-2"><strong>Merchant:</strong> <span className="text-secondary">{deal.merchant?.businessName || '-'}</span></div>
            <div className="mt-4">
              <button
                className={`btn btn-success me-2 px-4${deal.claimed ? ' active' : ''}`}
                onClick={handleClaim}
                disabled={claiming}
              >
                {deal.claimed ? (claiming ? 'Unclaiming...' : 'Unclaim') : (claiming ? 'Claiming...' : 'Claim')}
              </button>
              <button
                className={`btn btn-warning px-4${deal.favorited ? ' active' : ''}`}
                onClick={handleFavorite}
                disabled={favoriting}
              >
                {deal.favorited ? (favoriting ? 'Removing...' : 'Unfavorite') : (favoriting ? 'Favoriting...' : 'Favorite')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DealDetails;
