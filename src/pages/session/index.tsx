import {useState} from 'react';
import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SessionSection from '@session/SessionSection';
import { ReactElement } from 'react';
import { TRACK_NAME } from '@utils/constant';

import sessionData from '@session/sessionData.json'

const SessionList = () => {
    return (
        <>
        <Header pageName="세션" introduce="중앙대 멋사에서 진행한 세션을 소개합니다!" />

        <SessionSection trackName={TRACK_NAME[0]} trackNum={0} trackData={sessionData[0]} />
        <SessionSection trackName={TRACK_NAME[1]} trackNum={1} trackData={sessionData[1]} />
        <SessionSection trackName={TRACK_NAME[2]} trackNum={2} trackData={sessionData[2]} />
        <SessionSection trackName={TRACK_NAME[3]} trackNum={3} trackData={sessionData[3]} />

        </>
);


};

SessionList.getLayout = function getLayout(page: ReactElement) {
    return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default SessionList;
