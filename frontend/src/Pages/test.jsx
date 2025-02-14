import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  console.log(user); // Debugging line to check the user data

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};
    
export default Profile;