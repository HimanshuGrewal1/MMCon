import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FileText, 
  Book, 
  Users, 
  Tag, 
  ChevronRight, 
  ChevronDown,
  Inbox,
  Trash2,
  FileCode,
  StickyNote
} from 'lucide-react';
import LeftPane from "../components/homepageComponents/LeftPane"
import MiddlePane from "../components/homepageComponents/MiddlePane"
import RightPane from "../components/homepageComponents/RightPane"
// --- MOCK DATA ---
// We define data separately for clarity.
// In a real app, this would come from an API or database.

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
    type: 'meetingNote',
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
    type: 'book',
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
    type: 'journalArticle',
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
    type: 'webpage',
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
    type: 'code',
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

// --- HELPER ICONS ---
// A map to return an icon based on item type
const itemTypeIcons = {
  book: <Book className="w-4 h-4 text-blue-500" />,
  journalArticle: <FileText className="w-4 h-4 text-purple-500" />,
  meetingNote: <StickyNote className="w-4 h-4 text-yellow-600" />,
  webpage: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>,
  code: <FileCode className="w-4 h-4 text-gray-500" />,
  default: <FileText className="w-4 h-4 text-gray-400" />,
};

const getItemIcon = (type) => itemTypeIcons[type] || itemTypeIcons.default;

const collectionTypeIcons = {
  library: <Book className="w-4 h-4 text-blue-600" />,
  group: <Users className="w-4 h-4 text-green-600" />,
  collection: <Folder className="w-4 h-4 text-yellow-600" />,
};

const getCollectionIcon = (type) => collectionTypeIcons[type] || <Folder className="w-4 h-4 text-gray-400" />;

// --- PAGE: App ---
// This is the main "page" component that compiles all others.

export default function HomePage() {
  const [collections, setCollections] = useState(collectionsData);
  const [allItems, setAllItems] = useState(allItemsData);
  const [tags, setTags] = useState(allTagsData);
  
  const [selectedCollectionId, setSelectedCollectionId] = useState('project-omega');
  const [selectedItemId, setSelectedItemId] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);

  // --- Helper function to find a collection by ID recursively ---
  const findCollectionById = (collections, id) => {
    for (const collection of collections) {
      if (collection.id === id) return collection;
      if (collection.children) {
        const found = findCollectionById(collection.children, id);
        if (found) return found;
      }
    }
    // Check special "collections"
    if (id === 'unfiled') return { id: 'unfiled', name: 'Unfiled Items' };
    if (id === 'trash') return { id: 'trash', name: 'Trash' };
    return null;
  };

  // --- Memoized values for performance ---
  
  // Get the name of the currently selected collection
  const selectedCollectionName = useMemo(() => {
    const collection = findCollectionById(collections, selectedCollectionId);
    return collection ? collection.name : 'All Items';
  }, [collections, selectedCollectionId]);

  // Get all descendant collection IDs for filtering
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

  // Filter items based on selected collection or tag
  const filteredItems = useMemo(() => {
    let items = allItems;

    if (selectedTag) {
      items = items.filter(item => item.tags.includes(selectedTag));
    } else if (selectedCollectionId) {
      if (selectedCollectionId === 'my-library') {
        // Show all items except those in trash
        items = allItems.filter(item => item.collectionId !== 'trash');
      } else if (selectedCollectionId === 'unfiled') {
        items = items.filter(item => item.collectionId === 'unfiled');
      } else if (selectedCollectionId === 'trash') {
        items = items.filter(item => item.collectionId === 'trash');
      } else {
        // Get the selected collection and all its children IDs
        const descendantIds = getDescendantIds(selectedCollectionId);
        items = items.filter(item => descendantIds.has(item.collectionId));
      }
    }
    
    // Sort by date added, newest first
    return items.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }, [allItems, selectedCollectionId, selectedTag, collections]);

  // --- Event Handlers ---
  
  const handleSelectCollection = (id) => {
    setSelectedCollectionId(id);
    setSelectedTag(null); // Clear tag filter
    // Reset selected item if it's not in the new collection
    const itemsInNewSelection = filteredItems.map(i => i.id);
    if (!itemsInNewSelection.includes(selectedItemId)) {
      setSelectedItemId(itemsInNewSelection.length > 0 ? itemsInNewSelection[0].id : null);
    }
  };
  
  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setSelectedCollectionId(null); // Clear collection filter
    setSelectedItemId(null); // Reset selected item
  };

  const handleSelectItem = (id) => {
    setSelectedItemId(id);
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="h-screen w-screen flex flex-col">
        {/* Header/Toolbar (Simplified) */}
        <header className="flex-shrink-0 h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4">
          <h1 className="text-lg font-bold text-gray-700">ZoteroClone</h1>
          {/* Add toolbar buttons here */}
        </header>

        {/* Main 3-Pane Layout */}
        <main className="flex-grow grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Pane */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <LeftPane
              collections={collections}
              tags={tags}
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={handleSelectCollection}
              onSelectTag={handleSelectTag}
            />
          </div>

          {/* Middle Pane */}
          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <MiddlePane
              items={filteredItems}
              selectedItemId={selectedItemId}
              onSelectItem={handleSelectItem}
              selectedCollectionName={selectedTag ? `Tag: #${selectedTag}` : selectedCollectionName}
            />
          </div>

          {/* Right Pane */}
          <div className="col-span-1 md:col-span-5 lg:col-span-6">
            <RightPane
              items={allItems} // Pass all items so it can find the one by ID
              selectedItemId={selectedItemId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
