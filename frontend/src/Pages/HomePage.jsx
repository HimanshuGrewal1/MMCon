import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdf: null
  });
  const [recentNotebooks, setRecentNotebooks] = useState([]);
  const [featuredNotebooks, setFeaturedNotebooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects/project', { withCredentials: true });
      console.log('Fetched notebooks:', res.data);
      setFeaturedNotebooks(sampleFeaturedNotebooks);
      setRecentNotebooks(res.data.projects);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
      setError('Failed to load notebooks. Please try again later.');
      setRecentNotebooks([]);
      setFeaturedNotebooks([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, pdf: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pdf) {
      alert('Please provide a PDF file');
      return;
    }
    const data = new FormData();
    data.append("pdf", formData.pdf);

    setIsSubmitting(true);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/pdf-to-graph", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      const res2 = await axios.post("http://localhost:5000/api/projects/project", {
        title: formData.title,
        description: formData.description,
        nodes: res.data.nodes,
        edges: res.data.edges
      });

      console.log("Created project:", res2);
      setFormData({ title: '', description: '', pdf: null });
      setShowDialog(false);
      await fetchNotebooks();
    } catch (error) {
      console.error('Error creating notebook:', error);
      setError('Error creating notebook. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleclick = (projectId) => {
    navigator(`/project/${projectId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const sampleFeaturedNotebooks = [
    { id: 1, title: 'Our World in Daily', description: 'Trends in health, wealth and happiness', createdAt: '2025-04-15', sources: 24, category: 'Analytics' },
    { id: 2, title: 'Arts and Culture', description: 'William Shakespeare: The complete plays', createdAt: '2025-04-26', sources: 45, category: 'Literature' },
    { id: 3, title: 'Business Intelligence', description: 'Earnings reports for top corporations', createdAt: '2025-04-18', sources: 168, category: 'Business' },
    { id: 4, title: 'The World Ahead 2025', description: 'Future trends and predictions analysis', createdAt: '2025-07-07', sources: 70, category: 'Research' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f9f9] to-[#eaeaea] text-[#111] transition-colors duration-500">
      {/* Subtle animated gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-slate-300/30 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative max-w-6xl mx-auto py-10 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#111] to-[#444]">
            <Link to="/" className="flex items-center gap-2">
          <img src="./logo.png" alt="Logo" className="h-20 w-auto" />
        </Link>
          </h1>
          <p className="text-[#555] mt-1">Transform PDFs into interactive mind maps</p>
        </div>
    
      </header>

      {/* Error Box */}
      {error && (
        <div className="max-w-5xl mx-auto mb-6 p-4 rounded-xl bg-red-100 text-red-700 border border-red-200 backdrop-blur-sm">
          {error}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6">
        {/* Featured */}
                {/* Recent */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-[#111]">Your Recent Projects</h2>
            <span className="text-[#777] text-sm">{recentNotebooks.length} projects</span>
          </div>

          {/* Create new */}
          <button
            onClick={() => setShowDialog(true)}
            className="w-full bg-white/60 backdrop-blur-md border-2 border-dashed border-[#ccc] rounded-xl p-8 text-center hover:border-cyan-400 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-200 mx-auto rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-[#111]">Create New Mind Map</p>
            <p className="text-sm text-[#666] mt-1">Upload a PDF and generate an interactive mind map</p>
          </button>

          {/* Recent List */}
          <div className="mt-6 space-y-4">
            {recentNotebooks.map((n) => (
              <div
                onClick={() => handleclick(n._id)}
                key={n._id}
                className="bg-white/70 backdrop-blur-md border border-[#ddd] rounded-xl p-6 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-[#111]">{n.title}</h3>
                    <p className="text-sm text-[#555]">{n.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-[#777]">
                    <span>{formatDate(n.createdAt)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-[#111]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/80 backdrop-blur-lg border border-[#ddd] rounded-2xl p-8 w-full max-w-md shadow-xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#111]">Create New Mind Map</h2>
              <button onClick={() => setShowDialog(false)} className="text-[#666] hover:text-[#111]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-[#555] mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#ccc] rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition"
                  placeholder="Enter your project title"
                />
              </div>
              <div>
                <label className="block text-sm text-[#555] mb-2">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-[#ccc] rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
                  placeholder="Describe your project..."
                />
              </div>
              <div>
                <label className="block text-sm text-[#555] mb-2">Upload PDF *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="text-[#555] hover:text-[#111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#111] text-white rounded-lg hover:bg-[#333] transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating...' : 'Create Mind Map'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
