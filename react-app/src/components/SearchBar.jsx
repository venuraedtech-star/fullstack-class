function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-6 text-sm"
      placeholder="Search Products..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBar;
