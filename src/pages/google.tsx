import React, { useCallback } from 'react';
import {useRouter} from  'next/router';

import { login } from 'src/apis/account';

const Google = () => {
    const router = useRouter();
    const {code:code}=router.query;
    console.log(code);

    //is_active 여부 -> routing 처리 
    // (1:추가 입력페이지로 0:랜딩페이지로)
    // * => accessToken 발급 -> cookie에 넣기

    //login('code', 'accessToken') -> is_active 받아오기

    useCallback(()=>{
        // console.log(login('123','1234'));
        return 
    },[code]);

    // console.log(login('123','1234'));

    return (
        <div>
        
        </div>
    );
};

export default Google;