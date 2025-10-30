function CollectionTree({ collections, selectedCollectionId, onSelectCollection, level = 0 }) {
    const [expanded, setExpanded] = useState(
      // Expand 'My Library' and 'Group Libraries' by default
      new Set(collections.filter(c => c.type === 'library' || c.type === 'group').map(c => c.id))
    );
  
    const toggleExpand = (id) => {
      setExpanded(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    };
  
    return (
      <ul className="space-y-0.5">
        {collections.map(collection => {
          const isSelected = collection.id === selectedCollectionId;
          const isExpanded = expanded.has(collection.id);
          const hasChildren = collection.children && collection.children.length > 0;
  
          return (
            <li key={collection.id}>
              <div
                className={`flex items-center space-x-2 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
                style={{ paddingLeft: `${level * 1.25 + 0.25}rem` }}
                onClick={() => onSelectCollection(collection.id)}
              >
                {hasChildren ? (
                  <span onClick={(e) => { e.stopPropagation(); toggleExpand(collection.id); }} className="p-0.5 hover:bg-gray-300 rounded">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                ) : (
                  <span className="w-5"></span> // Placeholder for alignment
                )}
                <span className="shrink-0">{getCollectionIcon(collection.type)}</span>
                <span className="truncate text-sm font-medium">{collection.name}</span>
              </div>
              {isExpanded && hasChildren && (
                <CollectionTree
                  collections={collection.children}
                  selectedCollectionId={selectedCollectionId}
                  onSelectCollection={onSelectCollection}
                  level={level + 1}
                />
              )}
            </li>
          );
        })}
      </ul>
    );
  }
  
export default CollectionTree;