import { GetStaticPaths } from "next";
import { useEffect } from "react";


const FreeboardList = () => {
    return (
        <></>
    );
};

export default FreeboardList;


export const getStaticProps = async ({ params }: { params: { page: number; }; }) => {

    return {
        props: {

        },
        revalidate: 30,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    let paths: string[] = ['/freeboard/list/1'];
    return { paths, fallback: true };
};