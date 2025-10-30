
function LeftPane({ 
    collections, 
    tags, 
    selectedCollectionId, 
    onSelectCollection, 
    onSelectTag 
  }) {
    return (
      <div className="h-full flex flex-col border-r border-gray-300 bg-gray-50 overflow-y-auto">
        <div className="flex-grow p-2 space-y-2">
          <CollectionTree
            collections={collections}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={onSelectCollection}
          />
          <ul className="space-y-0.5">
             <li>
              <div
                className={`flex items-center space-x-2 p-1 pl-1 rounded-md cursor-pointer hover:bg-gray-200 ${selectedCollectionId === 'unfiled' ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
                onClick={() => onSelectCollection('unfiled')}
              >
                <span className="w-5"></span>
                <span className="shrink-0"><Inbox className="w-4 h-4 text-gray-600" /></span>
                <span className="truncate text-sm font-medium">Unfiled Items</span>
              </div>
            </li>
            <li>
              <div
                className={`flex items-center space-x-2 p-1 pl-1 rounded-md cursor-pointer hover:bg-gray-200 ${selectedCollectionId === 'trash' ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
                onClick={() => onSelectCollection('trash')}
              >
                <span className="w-5"></span>
                <span className="shrink-0"><Trash2 className="w-4 h-4 text-gray-600" /></span>
                <span className="truncate text-sm font-medium">Trash</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-shrink-0 border-t border-gray-300">
          <TagList tags={tags} onSelectTag={onSelectTag} />
        </div>
      </div>
    );
  }

  export default LeftPane;