import router from 'next/router';
import React from 'react';

const Login = () => {
    return (
        <div><button onClick={() => router.push('/signup')}>구글 로그인</button></div>
    );
};

export default Login;