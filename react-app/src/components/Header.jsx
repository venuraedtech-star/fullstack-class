function Header({ cartCount }) {
  return (
    <div className="flex item-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">Product Catalog</h1>
      </div>
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        Cart ({cartCount})
      </div>
    </div>
  );
}

export default Header;
