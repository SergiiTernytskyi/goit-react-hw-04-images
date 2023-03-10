import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { getImages } from 'services/imageApi';
import { GlobalStyle } from '../GlobalStyle';
import { Button } from 'components/Button/Button';
import { Error } from 'components/Error/Error';
import { Loader } from 'components/Loader/Loader';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Searchbar } from '../Searchbar/Searchbar';
import { Main } from './App.styled';

export function App() {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search === '') {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        if (page === 1) {
          setImages([]);
        }

        const data = await getImages(search, page);

        if (data.totalHits === 0) {
          setImages([]);
          setShowLoadMore(false);
          return toast.error(`Nothing found by Your query: "${search}"`);
        }

        const fetchedImages = data.hits.map(
          ({ id, tags, largeImageURL, webformatURL }) => {
            return { id, tags, largeImageURL, webformatURL };
          }
        );

        setImages(prevState => [...prevState, ...fetchedImages]);

        setShowLoadMore(page < Math.ceil(data.totalHits / 12) ? true : false);
      } catch {
        setError(`Something went wrong. Try one more time.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search]);

  const searchHandler = event => {
    event.preventDefault();

    const { imageSearch } = event.target.elements;

    if (imageSearch.value.trim() === '') {
      return toast.error('Enter something to search!!!');
    }

    setSearch(imageSearch.value);
    setPage(1);
    setError(null);

    if (imageSearch.value === search) {
      setShowLoadMore(false);
      return toast.error('You have entered the same value!!!');
    }
  };

  const loadMoreHandler = () => {
    setPage(prevState => prevState + 1);
    setError(null);
  };

  return (
    <>
      <Searchbar onSubmit={searchHandler} />
      <Main>
        {loading && <Loader />}
        {error && <Error>{error}</Error>}
        {images.length > 0 && <ImageGallery images={images} />}
        {showLoadMore && <Button onClick={loadMoreHandler} />}
      </Main>
      <Toaster position="top-right" reverseOrder={false} />
      <GlobalStyle />
    </>
  );
}
