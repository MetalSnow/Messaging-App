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

const API_URL = import.meta.env.VITE_API_URL;

const Settings = ({ user }) => {
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
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(null);

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
      const res = await patchData('PATCH', formData, user.id);
      setProfile(res.profile);
      setEditMode(null);
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
              <input
                type="text"
                name="bio"
                id="bio"
                defaultValue={profile?.bio}
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
      <form style={{ backgroundColor: editMode === 'account' && '#4a5568' }}>
        <button type="button" onClick={() => setEditMode('account')}>
          Edit <SquarePen />
        </button>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={user?.name}
            disabled={editMode !== 'account'}
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
          />
        </label>
        {editMode === 'account' && (
          <>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(null)}>
              Cancel
            </button>
          </>
        )}
      </form>
      <h3>Security & Password</h3>
      <form style={{ backgroundColor: editMode === 'password' && '#4a5568' }}>
        <button type="button" onClick={() => setEditMode('password')}>
          Change password <SquarePen />
        </button>
        {editMode === 'password' && (
          <div>
            <label htmlFor="password">
              Current Password:
              <input type="password" name="password" id="password" />
            </label>
            <label htmlFor="password">
              New Password:
              <input type="password" name="password" id="password" />
            </label>
            <label htmlFor="password">
              Re-type new Password:
              <input type="password" name="password" id="password" />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(null)}>
              Cancel
            </button>
          </div>
        )}
      </form>
      <button>Log out</button>
      <button>Delete Account</button>
    </div>
  );
};

export default Settings;
