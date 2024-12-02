import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useGetProfileQuery } from '../features/auth/authApi';
import { logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  
  const { data: profile, error } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (error) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return {
    user,
    isAuthenticated: !!token,
    role: user?.role,
    profile: profile?.data,
  };
};

export default useAuth;