
// --- COMPONENT 4: ItemCard ---
// Renders a single item in the middle pane list

function ItemCard({ item, isSelected, onSelectItem }) {
    return (
      <div
        className={`p-2 border-b border-gray-200 cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
        onClick={() => onSelectItem(item.id)}
      >
        <div className="flex items-center space-x-2">
          <span className="shrink-0">{getItemIcon(item.type)}</span>
          <h4 className="text-sm font-semibold truncate text-gray-900">{item.title}</h4>
        </div>
        <div className="pl-6 text-xs text-gray-600 truncate">{item.creator}</div>
        <div className="pl-6 text-xs text-gray-400">{item.dateAdded}</div>
      </div>
    );
  }
  
  export default ItemCard;