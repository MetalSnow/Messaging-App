import { ListFilter } from 'lucide-react';

const Messages = () => {
  return (
    <div>
      <h2>Messages</h2>
      <div>
        <button>All</button>
        <ListFilter size={14} />
      </div>
      <ul></ul>
    </div>
  );
};

export default Messages;
