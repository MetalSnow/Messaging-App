import { useRef, useState } from 'react';
import { format } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';

const Message = ({ msg, user }) => {
  const [editInput, setEditInput] = useState(msg.message);
  const formRef = useRef(null);
  const paraRef = useRef(null);
  const handleEdit = () => {
    formRef.current.style = 'display: block;';
    paraRef.current.style = 'display: none;';
  };

  const editMsg = (e, msgId) => {
    e.preventDefault();
    console.log(editInput);
    formRef.current.style = 'display: none;';
    paraRef.current.style = 'display: block;';
    console.log(msgId);
  };

  const isEditable =
    new Date().getTime() - new Date(msg.createdAt).getTime() < 5 * 60 * 1000;

  return (
    <>
      <p ref={paraRef}>{msg.message}</p>
      <form
        onSubmit={(e) => editMsg(e, msg.id)}
        ref={formRef}
        style={{ display: 'none' }}
      >
        <input
          onChange={(e) => setEditInput(e.target.value)}
          type="text"
          name="editedMsg"
          value={editInput}
        />
      </form>
      <span>{format(new Date(msg.createdAt), 'MM/dd/yy HH:mm')}</span>
      <button>
        <EllipsisVertical />
      </button>
      <div>
        {msg.senderId === user.id && isEditable && (
          <button onClick={handleEdit}>Edit</button>
        )}
        <button>{msg.senderId === user.id ? 'unsend' : 'remove'}</button>
      </div>
    </>
  );
};

export default Message;
