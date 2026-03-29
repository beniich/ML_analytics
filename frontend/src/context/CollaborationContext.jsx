import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const CollaborationContext = createContext(null);

export const CollaborationProvider = ({ children, roomName = 'ml-analytics-room' }) => {
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [sharedState, setSharedState] = useState(null);

  useEffect(() => {
    // Initialize Yjs Document
    const ydoc = new Y.Doc();
    
    // Connect to Y-Websocket server mapping to Redis PubSub backend
    // In production, WS_URL should adapt to scaling tiers
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/collab';
    const yprovider = new WebsocketProvider(wsUrl, roomName, ydoc);

    // Get a shared map for Dashboard Widgets layout/state
    const ymap = ydoc.getMap('dashboard-state');
    
    // Bind to component state
    setDoc(ydoc);
    setProvider(yprovider);
    setSharedState(ymap);

    yprovider.on('status', event => {
      setStatus(event.status); // 'connected' or 'disconnected'
    });

    return () => {
      yprovider.destroy();
      ydoc.destroy();
    };
  }, [roomName]);

  return (
    <CollaborationContext.Provider value={{ doc, provider, status, sharedState }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => useContext(CollaborationContext);
