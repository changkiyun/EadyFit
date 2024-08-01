import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">헬스</a>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/Board">게시판</a></li>
          <li><a href="/">운동 기록</a></li>
          <li><a href="/Food">식단 기록</a></li>
          <li><a href="/Food">운동 영상</a></li>
          <li><a href="/Food">재활</a></li>
          <li>
            <button onClick={handleLogin}>로그인</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
