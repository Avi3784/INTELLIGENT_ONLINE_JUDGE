import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        localStorage.setItem('token', token);
        
        // Let's reload to trigger the AuthContext useEffect to restore session
        window.location.href = '/dashboard';
      } else {
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="text-center">
        <span className="loading-spinner loading-spinner-lg mb-4 inline-block"></span>
        <h2 className="text-xl text-gray-300">Completing login...</h2>
      </div>
    </div>
  );
};

export default OAuthCallback;
