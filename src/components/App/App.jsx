import { Button } from 'components/Button/Button';
import { Error } from 'components/Error/Error';
import { Loader } from 'components/Loader/Loader';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getImages } from 'utils/imageApi';
import { GlobalStyle } from '../GlobalStyle';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Searchbar } from '../Searchbar/Searchbar';
import { Main } from './App.styled';

export function App() {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalImages, setTotalImages] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search === '') {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getImages(search, page);
        const fetchedImages = data.hits.map(
          ({ id, tags, largeImageURL, webformatURL }) => {
            return { id, tags, largeImageURL, webformatURL };
          }
        );

        setImages(prevState => [...prevState, ...fetchedImages]);
        setTotalImages(data.totalHits);
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

    if (imageSearch.value === search) {
      return toast.error('You have entered the same value!!!');
    }

    setImages([]);
    setPage(1);
    setTotalImages(null);
    setShowLoadMore(false);
  };

  const loadMoreHandler = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <>
      <Searchbar onSubmit={searchHandler} />
      <Main>
        {loading && <Loader />}
        {error && <Error>{error}</Error>}
        {totalImages === 0 && <Error>Nothing found, nothing to show</Error>}
        {images.length > 0 && <ImageGallery images={images} />}
        {showLoadMore && <Button onClick={loadMoreHandler} />}
      </Main>
      <Toaster position="top-right" reverseOrder={false} />
      <GlobalStyle />
    </>
  );
}
