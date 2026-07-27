export function ProductCard({ name, price, image, category, onAdd }) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={image} alt={name} className="product-image" />
      </div>
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-category">{category}</div>
        <div className="product-footer">
          <span className="product-price">{price}</span>
          <button className="add-btn" onClick={onAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// useState, useEffect, useRef, useMemo, useContext
