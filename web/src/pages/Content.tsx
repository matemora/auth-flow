import React, { useCallback, useEffect, useState } from 'react';
import { FiRotateCw } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../api/api';
import '../styles/Content.css';

interface IContent {
  status: 'error' | 'success';
  message: string;
  publicContent?: string;
  authenticatedContent?: string;
  authorizedContent?: string;
}

export default function Content() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [publicContent, setPublic] = useState<string | undefined>('');
  const [authenticatedContent, setAuthenticated] = useState<string | undefined>('');
  const [authorizedContent, setAuthorized] = useState<string | undefined>('');

  const handleContent = useCallback(async (token: string | null) => {
    const response = await api.get<IContent>('/content', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : token,
      }
    });
    if(response.data.status === 'error' && response.data.message === 'INVALID TOKEN'){
      localStorage.removeItem('token');
    }
    setPublic(response.data.publicContent);
    setAuthenticated(response.data.authenticatedContent);
    setAuthorized(response.data.authorizedContent);
    setLoading(false);
  }, [])
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    handleContent(token);
  }, [handleContent, history])

  return (
    loading ? (
      <FiRotateCw className="loading" color="white" size={96} />
    ) : (
        <>
          <div className="content" id="public">
            {publicContent && <span id="public">{publicContent}</span >}
            {authorizedContent && <span id="authorized">{authorizedContent}</span>}
            {authenticatedContent && <span id="authenticated">{authenticatedContent}</span>}
          {!authorizedContent && (<button type="button" onClick={() => history.push('/signin')}>
            Login to view more!
          </button>)}
          </div >
        </>
      )
  )
}