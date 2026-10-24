import React, { useState, useMemo } from 'react';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon, MoreIcon } from './AdminIcons.jsx';

export default function AdminItemsTable({
  dishes = [],
  currency = 'ETB',
  onAddItem,
  onEditDish,
  onDeleteDish,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return dishes;
    const q = searchQuery.toLowerCase().trim();
    return dishes.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      (d.categoryName && d.categoryName.toLowerCase().includes(q))
    );
  }, [dishes, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / itemsPerPage));
  const currentDishes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDishes.slice(start, start + itemsPerPage);
  }, [filteredDishes, currentPage, itemsPerPage]);

  return (
    <div className="ad-table-card">
      {/* Toolbar */}
      <div className="ad-table-toolbar">
        <div>
          <h3 className="ad-card-title">Menu Items</h3>
          <p className="ad-card-sub">Manage your cafe menu items and pricing</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="ad-search-pill" style={{ width: '240px', padding: '0.45rem 1rem' }}>
            <span style={{ color: '#9ca3af', display: 'inline-flex' }}>
              <SearchIcon size={14} />
            </span>
            <input
              type="search"
              className="ad-search-pill-input"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter menu items table"
            />
          </div>

          <button
            type="button"
            className="ad-btn-add"
            onClick={onAddItem}
            aria-label="Add new item"
          >
            <PlusIcon size={15} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ad-table-container">
        <table className="ad-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" aria-label="Select all items" />
              </th>
              <th style={{ width: '70px' }}>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDishes.length > 0 ? (
              currentDishes.map((dish) => (
                <tr key={dish.id}>
                  <td>
                    <input type="checkbox" aria-label={`Select ${dish.name}`} />
                  </td>
                  <td>
                    <img
                      src={dish.image || '/images/dishes/classic-beef-burger.jpg'}
                      alt={dish.name}
                      className="ad-table-thumb"
                      onError={(e) => {
                        e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
                      }}
                    />
                  </td>
                  <td>
                    <div className="ad-table-name">{dish.name}</div>
                  </td>
                  <td>
                    <span className="ad-category-badge">{dish.categoryName || 'General'}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#121826' }}>
                      {dish.price} {dish.currency || currency}
                    </strong>
                  </td>
                  <td>
                    <span className="ad-status-pill">Active</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="ad-action-btns" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="ad-icon-action"
                        onClick={() => onEditDish(dish)}
                        title="Edit dish"
                        aria-label={`Edit ${dish.name}`}
                      >
                        <EditIcon size={15} />
                      </button>
                      <button
                        type="button"
                        className="ad-icon-action ad-icon-action--delete"
                        onClick={() => onDeleteDish(dish)}
                        title="Delete dish"
                        aria-label={`Delete ${dish.name}`}
                      >
                        <TrashIcon size={15} />
                      </button>
                      <button
                        type="button"
                        className="ad-icon-action"
                        title="More options"
                        aria-label="More options"
                      >
                        <MoreIcon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#6c757d' }}>
                  No menu items found. Click "+ Add Item" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="ad-pagination">
        <span>
          Showing {currentDishes.length} of {filteredDishes.length} items
        </span>
        <div className="ad-page-numbers">
          <button
            type="button"
            className="ad-page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              type="button"
              className={`ad-page-btn ${currentPage === i + 1 ? 'is-active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            className="ad-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
