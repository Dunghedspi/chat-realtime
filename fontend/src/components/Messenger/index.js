import React from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';

export default function Messenger(props) {
  
  return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList {...props}/>
        </div>

        <div className="scrollable content">
          <MessageList {...props}/>
        </div>
      </div>
    );
}