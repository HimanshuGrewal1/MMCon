
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

  export default TagList;