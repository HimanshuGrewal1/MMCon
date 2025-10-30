import React, { useState, useMemo } from 'react';



const collectionsData = [
  { 
    id: 'my-library', 
    name: 'My Library', 
    type: 'library',
    children: [
      {
        id: 'project-omega',
        name: 'Project "Omega"',
        type: 'collection',
        children: []
      },
      {
        id: 'cs-241',
        name: 'CS 241: Data Structures',
        type: 'collection',
        children: [
          {
            id: 'cs-241-week-1',
            name: 'Week 1: Arrays',
            type: 'collection',
            children: []
          }
        ]
      },
    ]
  },
  {
    id: 'group-lib',
    name: 'Group Libraries',
    type: 'group',
    children: [
      {
        id: 'shared-research',
        name: 'Shared Research',
        type: 'collection',
        children: []
      }
    ]
  },
];

const allItemsData = [
  {
    id: 1,
    collectionId: 'project-omega',
    type: 'Meeting Note', // Changed from type 'meetingNote' for display
    title: 'Project "Omega" - Kickoff',
    creator: 'Alex Chen',
    dateAdded: '2025-10-30',
    abstract: 'Initial planning session for Q4. Key takeaways: 1. Define API endpoints. 2. Set up CI/CD pipeline.',
    tags: ['project-omega', 'planning', 'priority'],
    notes: [
      { id: 'n1', content: 'Need to follow up with team_member_A about auth module.' },
      { id: 'n2', content: 'Draft timeline for presentation.' }
    ]
  },
  {
    id: 2,
    collectionId: 'cs-241-week-1',
    type: 'Book', // Changed from type 'book'
    title: '"Clean Architecture" by Robert C. Martin',
    creator: 'Robert C. Martin',
    dateAdded: '2025-10-29',
    abstract: 'A craftsman\'s guide to software structure and design.',
    tags: ['reading', 'cs-241', 'architecture'],
    notes: []
  },
  {
    id: 3,
    collectionId: 'cs-241',
    type: 'Journal Article', // Changed from type 'journalArticle'
    title: 'Attention Is All You Need',
    creator: 'Vaswani, et al.',
    dateAdded: '2025-10-27',
    abstract: 'The paper introducing the Transformer model architecture.',
    tags: ['reading', 'ai', 'transformers', 'cs-241'],
    notes: []
  },
  {
    id: 4,
    collectionId: 'unfiled',
    type: 'Webpage', // Changed from type 'webpage'
    title: 'Personal Blog - Deployment Script',
    creator: 'Alex Chen',
    dateAdded: '2025-10-25',
    abstract: 'A blog post detailing a CI/CD script for deployment.',
    tags: ['devops', 'blogging'],
    notes: []
  },
  {
    id: 5,
    collectionId: 'project-omega',
    type: 'Code', // Changed from type 'code'
    title: 'Auth Module v1',
    creator: 'Alex Chen',
    dateAdded: '2025-10-31',
    abstract: 'Initial commit for the authentication service.',
    tags: ['project-omega', 'code', 'auth'],
    notes: []
  },
];

const allTagsData = [
  'project-omega', 'planning', 'priority', 'reading', 'cs-241', 'architecture', 'ai', 'transformers', 'devops', 'blogging', 'code', 'auth'
];



function CollectionTree({ collections, selectedCollectionId, onSelectCollection, level = 0 }) {
  const [expanded, setExpanded] = useState(

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
                <span 
                  onClick={(e) => { e.stopPropagation(); toggleExpand(collection.id); }} 
                  className="p-0.5 hover:bg-gray-300 rounded w-5 h-5 flex items-center justify-center text-xs font-mono"
                >
                  {isExpanded ? 'v' : '>'}
                </span>
              ) : (
                <span className="w-5"></span> 
              )}
           
              <span className="text-xs text-gray-500 font-mono select-none">
                {collection.type === 'library' && '[L]'}
                {collection.type === 'group' && '[G]'}
                {collection.type === 'collection' && '[C]'}
              </span>
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


function TagList({ tags, onSelectTag }) {
  return (
    <div className="p-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            onClick={() => onSelectTag(tag)}
            className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full cursor-pointer hover:bg-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}



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
              style={{ paddingLeft: `0.25rem` }}
            >
              <span className="w-5"></span> 
              <span className="text-xs text-gray-500 font-mono select-none">[I]</span>
              <span className="truncate text-sm font-medium">Unfiled Items</span>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-2 p-1 pl-1 rounded-md cursor-pointer hover:bg-gray-200 ${selectedCollectionId === 'trash' ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
              onClick={() => onSelectCollection('trash')}
              style={{ paddingLeft: `0.25rem` }}
            >
              <span className="w-5"></span> 
              <span className="text-xs text-gray-500 font-mono select-none">[T]</span>
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



function ItemCard({ item, isSelected, onSelectItem }) {
  return (
    <div
      className={`p-2 border-b border-gray-200 cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
      onClick={() => onSelectItem(item.id)}
    >
      <div className="flex items-center space-x-2">

        <span className="text-xs font-medium text-blue-600 w-20 shrink-0 truncate">{item.type}</span>
        <h4 className="text-sm font-semibold truncate text-gray-900">{item.title}</h4>
      </div>
     
      <div className="pl-22 text-xs text-gray-600 truncate">{item.creator}</div>
      <div className="pl-22 text-xs text-gray-400">{item.dateAdded}</div>
    </div>
  );
}



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
       
        <span className="mr-3 shrink-0 text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
          {item.type}
        </span>
        <h2 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h2>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 px-4">
          <TabButton id="info" label="Info" />
          <TabButton id="notes" label="Notes" />
          <TabButton id="tags" label="Tags" />
        </nav>
      </div>
      
   
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




export default function App() {
  const [collections, setCollections] = useState(collectionsData);
  const [allItems, setAllItems] = useState(allItemsData);
  const [tags, setTags] = useState(allTagsData);
  
  const [selectedCollectionId, setSelectedCollectionId] = useState('project-omega');
  const [selectedItemId, setSelectedItemId] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);


  const findCollectionById = (collections, id) => {
    for (const collection of collections) {
      if (collection.id === id) return collection;
      if (collection.children) {
        const found = findCollectionById(collection.children, id);
        if (found) return found;
      }
    }
    
    if (id === 'unfiled') return { id: 'unfiled', name: 'Unfiled Items' };
    if (id === 'trash') return { id: 'trash', name: 'Trash' };
    return null;
  };

  // -
  const selectedCollectionName = useMemo(() => {
    const collection = findCollectionById(collections, selectedCollectionId);
    return collection ? collection.name : 'All Items';
  }, [collections, selectedCollectionId]);

  const getDescendantIds = (collectionId) => {
    const ids = new Set([collectionId]);
    const collection = findCollectionById(collections, collectionId);
    
    function recurse(currentCollection) {
      if (!currentCollection || !currentCollection.children) return;
      for (const child of currentCollection.children) {
        ids.add(child.id);
        recurse(child);
      }
    }
    
    recurse(collection);
    return ids;
  };

  const filteredItems = useMemo(() => {
    let items = allItems;

    if (selectedTag) {
      items = items.filter(item => item.tags.includes(selectedTag));
    } else if (selectedCollectionId) {
      if (selectedCollectionId === 'my-library') {
        
        items = allItems.filter(item => item.collectionId !== 'trash');
      } else if (selectedCollectionId === 'unfiled') {
        items = items.filter(item => item.collectionId === 'unfiled');
      } else if (selectedCollectionId === 'trash') {
        items = items.filter(item => item.collectionId === 'trash');
      } else {
     
        const descendantIds = getDescendantIds(selectedCollectionId);
        items = items.filter(item => descendantIds.has(item.collectionId));
      }
    }
    
    
    return items.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }, [allItems, selectedCollectionId, selectedTag, collections]);


  
  const handleSelectCollection = (id) => {
    setSelectedCollectionId(id);
    setSelectedTag(null); 
   
    const itemsInNewSelection = filteredItems.map(i => i.id);
    if (!itemsInNewSelection.includes(selectedItemId)) {
      setSelectedItemId(itemsInNewSelection.length > 0 ? itemsInNewSelection[0].id : null);
    }
  };
  
  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setSelectedCollectionId(null); 
    setSelectedItemId(null); 
  };

  const handleSelectItem = (id) => {
    setSelectedItemId(id);
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      <style>{`
        /* Custom utility for indentation */
        .pl-22 {
          padding-left: 5.5rem; /* 88px, which is 20 (w-20) * 4 (base) + 2 (space-x-2) * 4 = 80 + 8 = 88px */
        }
      `}</style>
      <div className="h-screen w-screen flex flex-col">
       
        <header className="flex-shrink-0 h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4">
          <h1 className="text-lg font-bold text-gray-700">MMCon</h1>
          
        </header>

      
        <main className="flex-grow grid grid-cols-1 md:grid-cols-12 min-h-0">
         
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <LeftPane
              collections={collections}
              tags={tags}
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={handleSelectCollection}
              onSelectTag={handleSelectTag}
            />
          </div>

   
          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <MiddlePane
              items={filteredItems}
              selectedItemId={selectedItemId}
              onSelectItem={handleSelectItem}
              selectedCollectionName={selectedTag ? `Tag: #${selectedTag}` : selectedCollectionName}
            />
          </div>

        
          <div className="col-span-1 md:col-span-5 lg:col-span-6">
            <RightPane
              items={allItems} 
              selectedItemId={selectedItemId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

