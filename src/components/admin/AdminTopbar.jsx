import React from 'react';
import { CoffeeIcon } from '../common/Icons.jsx';

export default function AdminTopbar({ isAuthenticated, saveState, onSignOut }) {
  return (
    <header className="topbar">
      <div className="wrap topbar__inner">
        <a className="brand" href="/admin">
          <span className="brand__logo" id="cafeLogo">
            <CoffeeIcon size={20} />
          </span>
          <span className="brand__text">
            <span className="brand__name">Menu Admin</span>
            <span className="brand__tag" id="saveState">
              {saveState}
            </span>
          </span>
        </a>
        <div className="topbar__actions">
          <a
            className="btn btn--ghost"
            href="/cafe"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View Live Menu</span>
            <span aria-hidden="true">&#8599;</span>
          </a>
          {isAuthenticated && (
            <button
              className="btn btn--ghost"
              id="logoutBtn"
              type="button"
              onClick={onSignOut}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
