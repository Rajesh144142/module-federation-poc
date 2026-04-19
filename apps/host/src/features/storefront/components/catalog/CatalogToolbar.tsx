interface CatalogToolbarProps {
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function CatalogToolbar({
  categories,
  selectedCategory,
  searchTerm,
  onCategoryChange,
  onSearchTermChange,
}: CatalogToolbarProps) {
  return (
    <div className="catalog-toolbar">
      <label className="toolbar-field">
        <span>Search</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search products"
        />
      </label>

      <label className="toolbar-field">
        <span>Category</span>
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
