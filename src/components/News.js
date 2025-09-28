import React, { useState, useEffect, useCallback } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

const News = ({ country = 'in', pageSize = 8, category = 'general', setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentCountry, setCurrentCountry] = useState(country);

  // Capitalize category
  const capitalizeFirstLetter = useCallback(
    (string) => string.charAt(0).toUpperCase() + string.slice(1),
    []
  );

  // Fetch news from backend
  const updateNews = useCallback(
    async (reset = false, tryFallback = true) => {
      setProgress(20);
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/news?country=${currentCountry}&category=${category}&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if ((data.status === 'ok' || data.articles) && data.articles.length > 0) {
          setArticles((prev) => (reset ? data.articles : prev.concat(data.articles || [])));
          setTotalResults(data.totalResults || 0);
        } else if (tryFallback && currentCountry !== 'us') {
          // Fallback to US if IN returns 0 articles
          setCurrentCountry('us');  // fixed from 'in' to 'us'
        } else {
          alert(`No articles found for ${currentCountry} / ${category}`);
          setArticles([]);
          setTotalResults(0);
        }
      } catch (error) {
        alert('Failed to fetch news. Check your backend or API key.');
        console.error(error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    },
    [currentCountry, category, page, pageSize, setProgress]
  );

  // Initial load or when category/pageSize changes
  useEffect(() => {
    setPage(1);
    setArticles([]);
    updateNews(true);
    document.title = `${capitalizeFirstLetter(category)} - FactStream`;
  }, [category, pageSize, updateNews, capitalizeFirstLetter]);

  // Load more news on page change (infinite scroll)
  useEffect(() => {
    if (page > 1) updateNews(false);
  }, [page, updateNews]);

  const fetchMoreData = () => setPage((prev) => prev + 1);

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ margin: '90px 0px 40px 0px' }}>
        FactStream - {capitalizeFirstLetter(category)} Headlines
      </h1>

      {loading && page === 1 && <Spinner />}

      {articles.length === 0 && !loading && (
        <p className="text-center">No articles found for this category/country.</p>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className="row">
          {articles.map((article, index) =>
            article?.title ? (
              <div className="col-md-4" key={article.url || index}>
                <NewsItem
                  title={article.title?.slice(0, 45)}
                  description={article.description?.slice(0, 88)}
                  imageUrl={article.urlToImage}
                  newsUrl={article.url}
                  author={article.author}
                  date={article.publishedAt}
                  source={article.source?.name}
                />
              </div>
            ) : null
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func,
};

export default News;
