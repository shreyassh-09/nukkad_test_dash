import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false); // false = Login tab active, true = Register tab active
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  
  // Feedback State
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null); setError(null);

    try {
      if (isSignUp) {
        // 1. REGISTRATION FLOW: Pass extra profile details securely into Supabase user metadata
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company: company,
            }
          }
        });
        if (error) throw error;
        setMessage('Account successfully provisioned! Please check your email inbox to verify your identity.');
      } else {
        // 2. LOGIN FLOW: Standard credential authentication
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  // Switch tabs and reset temporary state fields cleanly
  const toggleTab = (toSignUp) => {
    setIsSignUp(toSignUp);
    setMessage(null);
    setError(null);
  };

  const tabStyle = (active) => ({
    flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold',
    cursor: 'pointer', borderBottom: active ? '2px solid #50aef4' : '2px solid #2a2a2a',
    color: active ? '#fff' : '#666', backgroundColor: active ? '#1b1b1b' : '#141414',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '10px', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
        
        {/* Dynamic Context Header Tabs */}
        <div style={{ display: 'flex', width: '100%', backgroundColor: '#141414' }}>
          <div style={tabStyle(!isSignUp)} onClick={() => toggleTab(false)}>
            Sign In
          </div>
          <div style={tabStyle(isSignUp)} onClick={() => toggleTab(true)}>
            Create Account
          </div>
        </div>

        {/* Form Body Container */}
        <div style={{ padding: '28px 24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
              {isSignUp ? 'Welcome !!' : 'Access Secure Portal'}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {isSignUp ? 'Provision your organization profile below' : 'Enter your registered service credentials'}
            </div>
          </div>

          {/* System Notifications */}
          {message && <div style={{ padding: '10px', backgroundColor: 'rgba(102, 192, 48, 0.1)', border: '1px solid #66c030', color: '#66c030', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>{message}</div>}
          {error && <div style={{ padding: '10px', backgroundColor: 'rgba(255, 77, 79, 0.1)', border: '1px solid #ff4d4f', color: '#ff4d4f', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Conditional Fields: Render strictly during Registration */}
            {isSignUp && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: '500' }}>Full Name</label>
                  <input 
                    type="text" required placeholder="e.g. Alex Rivera" value={fullName} onChange={e => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#141414', color: '#fff', fontSize: '13px', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: '500' }}>Organization / Company</label>
                  <input 
                    type="text" required placeholder="e.g. Acme Corp" value={company} onChange={e => setCompany(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#141414', color: '#fff', fontSize: '13px', outline: 'none' }} 
                  />
                </div>
              </>
            )}

            {/* Persistent Global Fields */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: '500' }}>Work Email</label>
              <input 
                type="email" required placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#141414', color: '#fff', fontSize: '13px', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: '500' }}>Password</label>
              <input 
                type="password" required placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#141414', color: '#fff', fontSize: '13px', outline: 'none' }} 
              />
              {isSignUp && <span style={{ fontSize: '10px', color: '#666', marginTop: '4px', display: 'block' }}>Minimum 6 characters required</span>}
            </div>

            {/* Primary Action Call */}
            <button 
              type="submit" disabled={loading}
              style={{ 
                padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', fontSize: '13px',
                backgroundColor: isSignUp ? '#66c030' : '#50aef4', color: '#fff', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 
              }}
            >
              {loading ? 'Processing Protocol...' : isSignUp ? 'Provision Organization Account' : 'Authorize Secure Session'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}