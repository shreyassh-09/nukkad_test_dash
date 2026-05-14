import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from './services/supabaseClient';
import Auth from './components/Auth';
import TopKeywordsGraph from './components/TopKeywordsGraph';
import TrafficSection from './components/TrafficSection';
import TopPagesTable from './components/TopPagesTable';
import TopPositionsTable from './components/TopPositionsTable';

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [pipelineState, setPipelineState] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Monitor Auth Session States persistently
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch full pipeline metrics directly when authorization validates successfully
  useEffect(() => {
    if (!session) return;
    
    async function executeIngestion() {
      setLoadingData(true);
      try {
        const res = await axios.get('http://localhost:8000/api/dashboard/pipeline');
        if (res.data.status === 'success') {
          const trafficArr = res.data.data.traffic || [];
          const formattedTraffic = trafficArr.map(item => {
            const yr = item.date ? item.date.substring(2, 4) : '';
            const mth = item.date ? parseInt(item.date.substring(4, 6), 10) : 1;
            const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return { ...item, formattedDate: `${mNames[mth - 1] || ''} '${yr}` };
          });
          
          setPipelineState({
            ...res.data.data,
            traffic: formattedTraffic // Supabase SQL layer sorts arrays natively
          });
        }
      } catch (err) {
        console.error("Remote DB execution buffer unmounted:", err);
      } finally {
        setLoadingData(false);
      }
    }
    executeIngestion();
  }, [session]);

  // Gatekeeper UI: Renders authentication components if session state is missing
  if (!session) {
    return (
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: '24px' }}>
          GoNukkad Dashboard
        </div>
        <Auth />
      </div>
    );
  }

  const tabStyle = (target) => ({
    padding: '12px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    color: activeTab === target ? '#fff' : '#888',
    borderBottom: activeTab === target ? '2px solid #50aef4' : '2px solid transparent',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Dynamic Authorization Header Interface */}
      <div style={{ borderBottom: '1px solid #2a2a2a', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>GoNukkad Dashboard</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Traffic Dashboard</div>
            <div style={tabStyle('keywords')} onClick={() => setActiveTab('keywords')}>Top Keywords Graph</div>
            <div style={tabStyle('pages')} onClick={() => setActiveTab('pages')}>Top Pages Table</div>
            <div style={tabStyle('positions')} onClick={() => setActiveTab('positions')}>Top Positions Module</div>
          </div>
        </div>

        {/* Secure Authorization Identifiers & Logout Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Active Profile:{' '}
            <span style={{ color: '#50aef4', fontWeight: 'bold' }}>
              {/* Safely fetch full_name from Supabase user metadata, fallback to email if empty */}
              {session.user.user_metadata?.full_name || session.user.email}
            </span>
            {session.user.user_metadata?.company && (
              <span style={{ color: '#666', marginLeft: '6px' }}>
                ({session.user.user_metadata.company})
              </span>
            )}
          </div>
          <button 
            onClick={() => supabase.auth.signOut()}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#141414', color: '#ff4d4f', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
          >
            Terminate Session
          </button>
        </div>
      </div>

      {loadingData ? (
        <div style={{ color: '#50aef4', fontSize: '15px' }}>Querying secure PostgreSQL production clusters...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeTab === 'overview' && <TrafficSection trafficData={pipelineState?.traffic} />}
          {activeTab === 'keywords' && <TopKeywordsGraph keywords={pipelineState?.keywords} />}
          {activeTab === 'pages' && <TopPagesTable pages={pipelineState?.pages} />}
          {activeTab === 'positions' && <TopPositionsTable positionsData={pipelineState?.positions} />}
        </div>
      )}

    </div>
  );
}