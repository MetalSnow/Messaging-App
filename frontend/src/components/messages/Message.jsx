import { useState } from 'react';
import { format } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';
import usePost from '../../hooks/usePost';

const API_URL = import.meta.env.VITE_API_URL;

const Message = ({ msg, user, refetchMsgs, friend, setConvo }) => {
  const [editInput, setEditInput] = useState(msg.message);
  const [showForm, setShowForm] = useState(false);
  const { postData, error, loading } = usePost(`${API_URL}/msg/${msg.id}`);

  const editMsg = async (e) => {
    e.preventDefault();
    if (editInput === '') return;

    try {
      const res = await postData('PATCH', { editedMsg: editInput });
      console.log(res);
      //Update the UI
      const msgs = await refetchMsgs('GET', friend.id);
      setConvo({ friend, msgs });
    } catch (error) {
      console.error(error);
    }

    setShowForm(false);
  };

  const isEditable =
    new Date().getTime() - new Date(msg.createdAt).getTime() < 5 * 60 * 1000;

  return (
    <>
      {!showForm && <p>{msg.message}</p>}
      <span style={{ fontSize: '10px' }}>
        {error ? 'Server error' : loading && 'loading...'}
      </span>
      {showForm && (
        <form onSubmit={editMsg}>
          <input
            onChange={(e) => setEditInput(e.target.value)}
            type="text"
            name="editedMsg"
            value={editInput}
          />
        </form>
      )}
      <span>{format(new Date(msg.createdAt), 'MM/dd/yy HH:mm')}</span>
      <button>
        <EllipsisVertical />
      </button>
      <div>
        {msg.senderId === user.id && isEditable && (
          <button onClick={() => setShowForm(true)}>Edit</button>
        )}
        <button>{msg.senderId === user.id ? 'unsend' : 'remove'}</button>
      </div>
    </>
  );
};

export default Message;
