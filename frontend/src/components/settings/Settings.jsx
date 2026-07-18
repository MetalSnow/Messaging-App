import {
  CircleSmall,
  LoaderCircle,
  Mars,
  SquarePen,
  Venus,
} from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import styles from './Settings.module.css';
import Select from 'react-select';
import usePost from '../../hooks/usePost';
import { useNavigate } from 'react-router-dom';
import Modal from '../modal/Modal';

const API_URL = import.meta.env.VITE_API_URL;

const Settings = ({ user, setUser }) => {
  const {
    fetchData: fetchProfile,
    loading,
    error,
  } = useFetch(`${API_URL}/profile/${user?.username}`);
  const {
    postData: patchData,
    loading: loadingPatch,
    error: errorPatch,
  } = usePost(`${API_URL}/profile/`);
  const {
    postData: patchUser,
    loading: loadingUser,
    error: errorUser,
    validation: userValidation,
  } = usePost(`${API_URL}/user`);
  const {
    postData: patchPassword,
    loading: loadingPassword,
    error: errorPassword,
    validation: passwordValidation,
  } = usePost(`${API_URL}/user/password`);
  const {
    postData: postLogOut,
    loading: loadingLogOut,
    error: errorLogOut,
  } = usePost(`${API_URL}/logout`);
  const [profile, setProfile] = useState(null);
  const [passwordMsg, setpasswordMsg] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        try {
          const data = await fetchProfile('GET');
          setProfile(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getProfile();
  }, [fetchProfile, user]);

  const editProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    try {
      if (editMode === 'profile') {
        const res = await patchData('PATCH', formData, user.id);
        setProfile(res.profile);
        setEditMode(null);
      } else if (editMode === 'account') {
        const updatedUser = Object.fromEntries(formData.entries());
        const res = await patchUser('PATCH', updatedUser);
        console.log(res);
        setUser(res.data);
        if (res.data) {
          setEditMode(null);
        }
      } else if (editMode === 'password') {
        const updatedPassword = Object.fromEntries(formData.entries());
        const res = await patchPassword('PATCH', updatedPassword);
        setpasswordMsg(res.message);
        if (res.data) {
          setEditMode(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await postLogOut('POST');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.settings}>
      <h2>Settings & privacy</h2>
      <h3>Profile details</h3>
      {error ? (
        <p>Server error occured!</p>
      ) : loading ? (
        <LoaderCircle className={styles.loader} />
      ) : (
        <form
          onSubmit={editProfile}
          style={{ backgroundColor: editMode === 'profile' && '#4a5568' }}
        >
          <button type="button" onClick={() => setEditMode('profile')}>
            Edit <SquarePen />
          </button>
          <label htmlFor="profilePic">
            Profile picture:
            <img src={profile?.profilePic} alt="profile-pic" width="80px" />
            {editMode === 'profile' && (
              <input
                type="file"
                name="profilePic"
                id="profilePic"
                accept="image/png, image/jpeg"
              />
            )}
          </label>
          <label htmlFor="coverPic">
            Cover picture:
            <img
              src={profile?.coverPic}
              alt="cover-pic"
              width={160}
              height={80}
            />
            {editMode === 'profile' && (
              <input
                type="file"
                name="coverPic"
                id="coverPic"
                accept="image/png, image/jpeg"
              />
            )}
          </label>
          <label htmlFor="gender">
            Gender:
            {editMode === 'profile' ? (
              <select name="gender" id="gender" defaultValue={profile?.gender}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            ) : (
              <p>
                {profile?.gender == 'MALE' ? (
                  <>
                    {' '}
                    <Mars size={18} color="#297fff" absoluteStrokeWidth /> Male
                  </>
                ) : profile?.gender == 'FEMALE' ? (
                  <>
                    <Venus size={18} color="#f56bff" absoluteStrokeWidth />{' '}
                    Female
                  </>
                ) : (
                  <>
                    <CircleSmall
                      size={18}
                      color="#fdea6f"
                      absoluteStrokeWidth
                    />
                    Other
                  </>
                )}
              </p>
            )}
          </label>
          <label htmlFor="bio">
            Bio:
            {editMode === 'profile' ? (
              <textarea
                name="bio"
                id="bio"
                defaultValue={profile?.bio}
                placeholder="Write your bio..."
              />
            ) : (
              <p>{profile?.bio}</p>
            )}
          </label>
          {editMode === 'profile' && (
            <>
              {loadingPatch ? (
                <LoaderCircle className={styles.loader} />
              ) : errorPatch ? (
                <p>Server error!</p>
              ) : (
                <button type="submit">Save</button>
              )}
              <button
                type="button"
                onClick={() => setEditMode(null)}
                disabled={loadingPatch}
              >
                Cancel
              </button>
            </>
          )}
        </form>
      )}
      <h3>Account details</h3>
      <form
        onSubmit={editProfile}
        style={{ backgroundColor: editMode === 'account' && '#4a5568' }}
      >
        <button type="button" onClick={() => setEditMode('account')}>
          Edit <SquarePen />
        </button>
        {userValidation && (
          <ul>
            {userValidation.map((error, index) => (
              <li key={index} style={{ color: 'red' }}>
                {error.msg}
              </li>
            ))}
          </ul>
        )}
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={user?.name}
            disabled={editMode !== 'account'}
            placeholder="Name"
          />
        </label>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            id="username"
            defaultValue={user?.username}
            disabled={editMode !== 'account'}
            placeholder="Username"
            required
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="text"
            name="email"
            id="email"
            defaultValue={user?.email}
            disabled={editMode !== 'account'}
            placeholder="Email address"
            required
          />
        </label>
        {editMode === 'account' && (
          <>
            {loadingUser ? (
              <LoaderCircle className={styles.loader} />
            ) : errorUser ? (
              <p>Server error!</p>
            ) : (
              <button type="submit">Save</button>
            )}
            <button
              type="button"
              onClick={() => setEditMode(null)}
              disabled={loadingPatch}
            >
              Cancel
            </button>
          </>
        )}
      </form>
      <h3>Security & Password</h3>
      <form
        onSubmit={editProfile}
        style={{ backgroundColor: editMode === 'password' && '#4a5568' }}
      >
        <button
          type="button"
          onClick={() => {
            setEditMode('password');
            setpasswordMsg(null);
          }}
        >
          Change password <SquarePen />
        </button>
        {passwordMsg && <p style={{ color: '#8ffb61dd' }}>{passwordMsg}</p>}
        {editMode === 'password' ? (
          <div>
            {passwordValidation && (
              <ul>
                {passwordValidation.map((error, index) => (
                  <li key={index} style={{ color: 'red' }}>
                    {error.msg}
                  </li>
                ))}
              </ul>
            )}
            <label htmlFor="currentPassword">
              Current Password:
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                placeholder="Current password"
                required
              />
            </label>
            <label htmlFor="newPassword">
              New Password:
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="New Password"
                required
              />
            </label>
            <label htmlFor="confirmedPassword">
              Re-type new Password:
              <input
                type="password"
                name="confirmedPassword"
                id="confirmedPassword"
                placeholder="Confirm new password"
                required
              />
            </label>
            {loadingPassword ? (
              <LoaderCircle className={styles.loader} />
            ) : errorPassword ? (
              <p>Server error!</p>
            ) : (
              <button type="submit">Save</button>
            )}
            <button type="button" onClick={() => setEditMode(null)}>
              Cancel
            </button>
          </div>
        ) : (
          <label>
            Password: <input type="password" value="**************" disabled />
          </label>
        )}
      </form>
      <button onClick={() => setIsOpen(true)}>Log out</button>
      <button>Delete Account</button>
      <Modal modalIsOpen={modalIsOpen} closeModal={() => setIsOpen(false)}>
        <h2>Log out?</h2>
        <p>Are you sure you want to log out?</p>
        {errorLogOut ? (
          <p>Server error!</p>
        ) : loadingLogOut ? (
          <LoaderCircle className={styles.loader} />
        ) : (
          <button onClick={handleLogOut}>Log out</button>
        )}
      </Modal>
    </div>
  );
};

export default Settings;
