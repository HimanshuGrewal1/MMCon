// --- COMPONENT 6: ItemDetails ---
// Renders the full details of the selected item in the right pane

function ItemDetails({ item }) {
  const [activeTab, setActiveTab] = useState('info');

  if (!item) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select an item to see details</p>
      </div>
    );
  }

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium ${
        activeTab === id
          ? 'border-b-2 border-blue-500 text-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="flex items-center p-4 border-b border-gray-200">
        <span className="mr-3 shrink-0">{getItemIcon(item.type)}</span>
        <h2 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 px-4">
          <TabButton id="info" label="Info" />
          <TabButton id="notes" label="Notes" />
          <TabButton id="tags" label="Tags" />
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="flex-grow p-4 space-y-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <InfoField label="Creator" value={item.creator} />
            <InfoField label="Date Added" value={item.dateAdded} />
            <InfoField label="Abstract" value={item.abstract} isBlock />
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="space-y-2">
            {item.notes.length > 0 ? (
              item.notes.map(note => (
                <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  {note.content}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notes for this item.</p>
            )}
            <button className="mt-2 text-sm text-blue-600 hover:underline">+ Add Note</button>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            <button className="text-sm text-blue-600 hover:underline">+ Add Tag</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for ItemDetails
function InfoField({ label, value, isBlock = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {isBlock ? (
        <p className="mt-1 text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{value}</p>
      ) : (
        <p className="text-sm text-gray-900">{value}</p>
      )}
    </div>
  );
}

export default ItemDetails