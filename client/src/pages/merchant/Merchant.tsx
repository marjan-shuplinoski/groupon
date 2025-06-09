import PageLayout from '../../components/PageLayout';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface DealRow {
  _id: string;
  title: string;
  status: string;
  description?: string;
  price?: number;
  discount?: number;
  terms?: string;
  expiry?: string;
  image?: string;
}

const Merchant = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    terms: '',
    expiry: '',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<{ totalDeals: number; totalClaimed: number; totalFavorited: number } | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  const fetchDeals = async () => {
    try {
      const res = await api.get('/merchant/deals');
      // @ts-expect-error: axios response type is unknown, deals is expected
      setDeals(res.data.deals);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to load deals');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/merchant/dashboard');
      type DealStat = { favoritedCount?: number; favorited?: number; savedCount?: number };
      const data = res.data as { deals?: DealStat[]; totalClaimed?: number };
      setAnalytics({
        totalDeals: data.deals?.length || 0,
        totalClaimed: data.totalClaimed || 0,
        totalFavorited: data.deals?.reduce((sum: number, d: DealStat) => sum + (d.favoritedCount || d.favorited || d.savedCount || 0), 0) || 0,
      });
      setShowAnalytics(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to load analytics');
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenModal = () => {
    setEditId(null);
    setForm({ title: '', description: '', price: '', discount: '', terms: '', expiry: '', image: '' });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleEdit = async (deal: DealRow) => {
    setEditId(deal._id);
    try {
      const res = await api.get(`/merchant/deals/${deal._id}`);
      // @ts-expect-error: axios response type is unknown, deal is expected
      const d = res.data.deal;
      setForm({
        title: d.title || '',
        description: d.description || '',
        price: d.price?.toString() || '',
        discount: d.discount?.toString() || '',
        terms: d.terms || '',
        expiry: d.expiry ? d.expiry.slice(0, 10) : '',
        image: d.image || '',
      });
      setShowModal(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to load deal info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/merchant/deals/${editId}`, {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          discount: Number(form.discount),
          terms: form.terms,
          expiry: form.expiry ? new Date(form.expiry) : undefined,
          image: form.image,
        });
        toast.success('Deal updated');
      } else {
        await api.post('/merchant/deals', {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          discount: Number(form.discount),
          terms: form.terms,
          expiry: form.expiry ? new Date(form.expiry) : undefined,
          image: form.image,
        });
        toast.success('Deal created');
      }
      setShowModal(false);
      setForm({ title: '', description: '', price: '', discount: '', terms: '', expiry: '', image: '' });
      fetchDeals();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to save deal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this deal?')) return;
    try {
      await api.delete(`/merchant/deals/${id}`);
      toast.success('Deal deleted');
      fetchDeals();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to delete deal');
    }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'published') {
        await api.put(`/merchant/deals/${id}`, { status: 'draft' });
        toast.success('Deal unpublished');
      } else {
        await api.put(`/merchant/deals/${id}`, { status: 'published' });
        toast.success('Deal published');
      }
      fetchDeals();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update deal status');
    }
  };

  // Preview modal state
  const [previewDeal, setPreviewDeal] = useState<DealRow | null>(null);

  return (
    <PageLayout title="Merchant Dashboard">
      <div className="container py-12" style={{ height: '70vh' }}>
        <div className="text-center mb-4">
          <h2>Welcome, Merchant!</h2>
          <p>Manage your deals and track your sales here.</p>
          <div className="mt-4">
            <button className="btn btn-light me-2" onClick={handleOpenModal}>Add New Deal</button>
            <button className="btn btn-outline-light" onClick={fetchAnalytics}>Deals Analytics</button>
          </div>
        </div>
        {showAnalytics && analytics && (
          <div className="alert alert-info text-center mb-4">
            <strong>Deals Analytics</strong><br />
            Total Deals: {analytics.totalDeals} <br />
            Total Claimed: {analytics.totalClaimed} <br />
            Total Favorited: {analytics.totalFavorited}
            <div className="mt-2">
              <button className="btn btn-sm btn-secondary" onClick={() => setShowAnalytics(false)}>Close</button>
            </div>
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-bordered align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" disabled /></th>
                <th>Name</th>
                <th>Image</th>
                <th>Expiry</th>
                <th style={{ width: 40 }} title="Edit">Edit</th>
                <th style={{ width: 40 }} title="Publish">Publish</th>
                <th style={{ width: 40 }} title="Delete">Delete</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal._id}>
                  <td><input type="checkbox" /></td>
                  <td>{deal.title}</td>
                  <td>
                    {deal.image ? (
                      <img src={deal.image} alt={deal.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span className="text-muted">No image</span>
                    )}
                  </td>
                  <td>{deal.expiry ? new Date(deal.expiry).toLocaleDateString() : <span className="text-muted">-</span>}</td>
                  <td className="text-center">
                    <button className="btn btn-link p-0" title="Edit" onClick={() => handleEdit(deal)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-pencil-square text-primary" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.707 0l-1-1a.5.5 0 0 1 0-.707l1-1a.5.5 0 0 1 .707 0l1 1z"/>
                        <path d="M13.5 3.207L6 10.707V13h2.293l7.5-7.5-2.293-2.293z"/>
                        <path fillRule="evenodd" d="M1 13.5V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h-1V2H2v11h11v-1h1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                      </svg>
                    </button>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-link p-0 text-success" title={deal.status === 'published' ? 'Unpublish' : 'Publish'} onClick={() => handlePublish(deal._id, deal.status)}>
                      {deal.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-link p-0" title="Delete" onClick={() => handleDelete(deal._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm3 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1-1V1.5A1.5 1.5 0 0 0 12 0h-8A1.5 1.5 0 0 0 2.5 1.5V2a1 1 0 0 1-1 1H1v1h14V3h-.5zm-1-1V1.5A.5.5 0 0 0 12 1h-8a.5.5 0 0 0-.5.5V2h11z"/>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/deals/${deal._id}`)}>
                      View Deal
                    </button>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr><td colSpan={8} className="text-center">No deals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Edit Deal' : 'Add New Deal'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <input name="title" className="form-control mb-2" placeholder="Title" value={form.title} onChange={handleInput} required />
                    <textarea name="description" className="form-control mb-2" placeholder="Description" value={form.description} onChange={handleInput} />
                    <input name="price" type="number" className="form-control mb-2" placeholder="Price" value={form.price} onChange={handleInput} required />
                    <input name="discount" type="number" className="form-control mb-2" placeholder="Discount (%)" value={form.discount} onChange={handleInput} required />
                    <input name="terms" className="form-control mb-2" placeholder="Terms" value={form.terms} onChange={handleInput} />
                    <input name="expiry" type="date" className="form-control mb-2" placeholder="Expiry" value={form.expiry} onChange={handleInput} />
                    <input name="image" className="form-control mb-2" placeholder="Image URL" value={form.image} onChange={handleInput} required />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={submitting}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create Deal')}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {previewDeal && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Deal Preview</h5>
                  <button type="button" className="btn-close" onClick={() => setPreviewDeal(null)}></button>
                </div>
                <div className="modal-body">
                  {previewDeal.image && <img src={previewDeal.image} alt={previewDeal.title} className="mb-3 w-100" style={{ maxHeight: 200, objectFit: 'cover', borderRadius: 4 }} />}
                  <h4>{previewDeal.title}</h4>
                  <p>{previewDeal.description}</p>
                  <p><strong>Price:</strong> {previewDeal.price ? `$${previewDeal.price}` : '-'}</p>
                  <p><strong>Discount:</strong> {previewDeal.discount ? `${previewDeal.discount}%` : '-'}</p>
                  <p><strong>Terms:</strong> {previewDeal.terms || '-'}</p>
                  <p><strong>Expiry:</strong> {previewDeal.expiry ? new Date(previewDeal.expiry).toLocaleDateString() : '-'}</p>
                  <p><strong>Status:</strong> {previewDeal.status}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setPreviewDeal(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Merchant;
