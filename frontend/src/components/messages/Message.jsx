import { useState } from 'react';
import { format } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';
import usePost from '../../hooks/usePost';
import useFetch from '../../hooks/useFetch';

const API_URL = import.meta.env.VITE_API_URL;

const Message = ({ msg, user, refetchMsgs, friend, setConvo }) => {
  const [editInput, setEditInput] = useState(msg.message);
  const [showForm, setShowForm] = useState(false);
  const { postData, error, loading } = usePost(`${API_URL}/msg/${msg.id}`);
  const {
    fetchData: removeMsg,
    error: errorRemove,
    loading: loadingRemove,
  } = useFetch(`${API_URL}/msg/${msg.id}`);

  const editMsg = async (e) => {
    e.preventDefault();
    if (editInput === '') return;

    try {
      await postData('PATCH', { editedMsg: editInput });

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

  const handlRemove = async () => {
    try {
      const res = await removeMsg('DELETE');
      console.log(res);
      //Update the UI
      const msgs = await refetchMsgs('GET', friend.id);
      setConvo({ friend, msgs });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!showForm && <p>{msg.message}</p>}
      <span style={{ fontSize: '10px' }}>
        {error || errorRemove
          ? 'Server error'
          : (loading || loadingRemove) && 'loading...'}
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
        <button onClick={handlRemove}>
          {msg.senderId === user.id ? 'unsend' : 'remove'}
        </button>
      </div>
    </>
  );
};

export default Message;
