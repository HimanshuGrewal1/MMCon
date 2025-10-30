
// --- COMPONENT 5: MiddlePane ---
// Renders the list of items for the selected collection
import ItemCard from "./ItemCard"

function MiddlePane({ items, selectedItemId, onSelectItem, selectedCollectionName }) {
  return (
    <div className="h-full flex flex-col border-r border-gray-300 bg-white overflow-y-auto">
      <div className="p-2 border-b border-gray-300 sticky top-0 bg-white z-10">
        <h3 className="font-semibold text-gray-800">{selectedCollectionName}</h3>
        <p className="text-sm text-gray-500">{items.length} items</p>
      </div>
      <div className="flex-grow">
        {items.length > 0 ? (
          items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              onSelectItem={onSelectItem}
            />
          ))
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            No items in this collection.
          </div>
        )}
      </div>
    </div>
  );
}

export default MiddlePane;