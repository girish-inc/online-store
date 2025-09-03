import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { fetchProducts } from '../redux/slices/productSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    products, 
    loading, 
    error, 
    totalCount, 
    totalPages, 
    hasNextPage, 
    hasPrevPage 
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Latest Products</h1>
        <div className="text-muted">
          {totalCount > 0 && (
            <span>Showing {products.length} of {totalCount} products</span>
          )}
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {products.length === 0 ? (
            <Message variant="info">No products found</Message>
          ) : (
            <>
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Container className="d-flex justify-content-center align-items-center mt-4">
                  <div className="d-flex align-items-center gap-3">
                    <Button 
                      variant="outline-primary" 
                      onClick={handlePrevPage}
                      disabled={!hasPrevPage || loading}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </Button>
                    
                    <span className="mx-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button 
                      variant="outline-primary" 
                      onClick={handleNextPage}
                      disabled={!hasNextPage || loading}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </Container>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;