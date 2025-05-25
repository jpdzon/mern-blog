import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Header() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/profile',{
      credentials: 'include',
    })
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', { 
      credentials: 'include',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <Link to="/logout" onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}