import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

interface Imovie {
  id: number;
  original_title: string;
  poster_path: string;
}

function Home({ result }: InferGetServerSidePropsType<GetServerSideProps>) {
  return (
    <div>
      <Head>
        <title>setting-practice</title>
      </Head>
      <div>Home</div>
      {result?.map((movie: Imovie) => (
        <div key={movie.id}>
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
          <h4>{movie?.original_title}</h4>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await axios.get(
    'https://api.themoviedb.org/3/movie/popular?api_key=0b509fc29bded6c0c259c6203d006b72',
  );
  const result = data?.results;
  console.log(result);
  return {
    props: {
      result,
    },
  };
}
export default Home;
