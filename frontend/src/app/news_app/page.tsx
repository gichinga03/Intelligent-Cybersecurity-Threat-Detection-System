"use client";

import { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

type Article = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
};

type RssFeed = {
  source: string;
  articles: Article[];
};

export default function RssPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/rss', { cache: 'no-store' });
        const data = await res.json();
        setFeeds(data);
      } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        setError('Failed to load RSS feeds. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`container mx-auto p-6 pt-20 transition-all duration-300 ${isSidebarOpen ? 'mr-64' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Threat Intelligence Feed</h1>
          <button 
            onClick={toggleSidebar}
            className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-xl">Loading feeds...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">
            <p className="text-xl">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeds.flatMap(feed => feed.articles).map((article, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-400 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Read more
                    </a>
                    <p className="text-gray-500 text-sm">{new Date(article.pubDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
