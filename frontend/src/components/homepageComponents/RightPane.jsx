// --- COMPONENT 7: RightPane ---
// Container for the item details
import ItemDetails from "./ItemDetails"

function RightPane({ items, selectedItemId }) {
  const selectedItem = useMemo(
    () => items.find(item => item.id === selectedItemId),
    [items, selectedItemId]
  );
  
  return (
    <div className="h-full">
      <ItemDetails item={selectedItem} />
    </div>
  );
}
export default RightPane;
