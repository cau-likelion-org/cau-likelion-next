import React, { useCallback, useEffect, useState } from 'react';
import {useRouter} from  'next/router';
import { login } from 'src/apis/account';
import { useRecoilState } from 'recoil';
import { accessToken } from '@utils/state';
import cookie from 'react-cookies';

const Google = () => {
    const router = useRouter();
    const {code: code}= router.query;
    const [tokenState, setTokenState] = useRecoilState(accessToken);


    //is_active 여부 -> routing 처리 
    // (1:추가 입력페이지로 0:랜딩페이지로)
    // * => accessToken 발급 -> cookie에 넣기
    
    const [active, setActive] = useState(true);

    const loginHandler = useCallback(async(code: string|string[], tokenState: string) => {
        const response = await login(code, tokenState)
        if(response.status_code === 400) {
            router.push('/login/failed')
            return;
        }
        else if(response.status_code === 201) {
            if(response.is_active) {
                setTokenState(response.accessToken)
                cookie.save('accessToken', response.accessToken, {path: '/'})
                router.push('/')
                return
            }
            else {
                router.push({
                    pathname: '/signup',
                    query: {accessToken: response.accessToken}
                }, '/signup')
            }
        }
    },[router, setTokenState])

    useEffect(()=>{
        console.log(typeof code);
        if(code) loginHandler(code, tokenState)
    },[loginHandler, code, tokenState])

    return (
        <div>
        
        </div>
    );
};

export default Google;