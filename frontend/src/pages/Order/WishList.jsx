import React from 'react'
import { useAuth } from '../../context/AuthContext';

const WishList = () => {

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <NotLoggedin/>

  }
  

  return (
    <div>WishList</div>
  )
}

export default WishList;