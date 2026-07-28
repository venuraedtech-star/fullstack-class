export function ProductCard({ name, price, image, category, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      <div className="bg-slate-50 h-40 flex items-center justify-center p-4">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">{name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          {category}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">${price}</span>
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
