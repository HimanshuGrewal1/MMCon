import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch notebooks from backend
  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      setError('');
      
      // For demo purposes - replace with actual API calls
      setFeaturedNotebooks(sampleFeaturedNotebooks);
      setRecentNotebooks(sampleRecentNotebooks);

    } catch (error) {
      console.error('Error fetching notebooks:', error);
      setError('Failed to load notebooks. Please try again later.');
      setRecentNotebooks([]);
      setFeaturedNotebooks([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      pdf: e.target.files[0]
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.pdf) {
    alert('Please provide a PDF file');
    return;
  }

  const data = new FormData();
  data.append('file', formData.pdf);

  setIsSubmitting(true);
  setLoading(true);

  try {
    const res = await axios.post('http://127.0.0.1:8000/upload-pdf', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    console.log('Upload success:', res.data);
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


  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Sample data
  const sampleFeaturedNotebooks = [
    {
      id: 1,
      title: 'Our World in Daily',
      description: 'Trends in health, wealth and happiness',
      createdAt: '2025-04-15',
      sources: 24,
      category: 'Analytics'
    },
    {
      id: 2,
      title: 'Arts and Culture',
      description: 'William Shakespeare: The complete plays',
      createdAt: '2025-04-26',
      sources: 45,
      category: 'Literature'
    },
    {
      id: 3,
      title: 'Business Intelligence',
      description: 'Earnings reports for top 50 corporations',
      createdAt: '2025-04-18',
      sources: 168,
      category: 'Business'
    },
    {
      id: 4,
      title: 'The World Ahead 2025',
      description: 'Future trends and predictions analysis',
      createdAt: '2025-07-07',
      sources: 70,
      category: 'Research'
    }
  ];

  const sampleRecentNotebooks = [
    {
      id: 1,
      title: 'MERN Authentication Guide',
      description: 'Complete JWT and refresh tokens implementation',
      createdAt: new Date().toISOString(),
      progress: 100
    },
    {
      id: 2,
      title: 'Project Documentation',
      description: 'API documentation and system architecture',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 75
    },
    {
      id: 3,
      title: 'Research Paper Analysis',
      description: 'Machine learning research findings',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MindMapper AI
            </h1>
            <p className="text-gray-400 mt-2">Transform PDFs into interactive mind maps</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="font-semibold">U</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="relative max-w-6xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto">
        {/* Featured Notebooks Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Featured Community Maps</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105">
                Explore All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleFeaturedNotebooks.map((notebook, index) => (
              <div 
                key={notebook.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500/50 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {notebook.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {notebook.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {notebook.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(notebook.createdAt)}</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{notebook.sources} sources</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Notebooks Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Your Recent Projects</h2>
            <span className="text-gray-400 text-sm">
              {sampleRecentNotebooks.length} projects
            </span>
          </div>

          <div className="space-y-4">
            {/* Create New Notebook Button */}
            <button
              onClick={() => setShowDialog(true)}
              className="group w-full bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-600 hover:border-blue-500 p-8 text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors">
                  Create New Mind Map
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Upload PDF and generate interactive mind map
                </p>
              </div>
            </button>

            {/* Recent Notebooks List */}
            {sampleRecentNotebooks.map((notebook, index) => (
              <div 
                key={notebook.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500/50 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {notebook.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {notebook.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Progress</div>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${notebook.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Created</div>
                      <div className="text-sm text-white">{formatDate(notebook.createdAt)}</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Create Notebook Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 max-w-md w-full p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Mind Map</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your project title"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all duration-300"
                    placeholder="Describe your project..."
                  />
                </div>

                {/* PDF Upload */}
                <div>
                  <label htmlFor="pdf" className="block text-sm font-medium text-gray-300 mb-2">
                    Upload PDF *
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-all duration-300 group">
                    <input
                      type="file"
                      id="pdf"
                      name="pdf"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                    <label htmlFor="pdf" className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-300 group-hover:text-white transition-colors">
                        {formData.pdf ? formData.pdf.name : 'Click to upload PDF file'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">Max file size: 10MB</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Mind Map'
                  )}
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