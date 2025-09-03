import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import Rating from '../components/common/Rating';

const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector((state) => state.products);

  const handleImageError = (e) => {
    e.target.src = '/images/no-image.svg';
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id: id, qty: qty }));
    navigate('/cart');
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : productDetails ? (
        <>
          <Row>
            <Col md={6}>
              <Image 
                src={productDetails.image} 
                alt={productDetails.name} 
                fluid 
                onError={handleImageError}
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{productDetails.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={productDetails.rating}
                    text={`${productDetails.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${productDetails.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {productDetails.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${productDetails.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {productDetails.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {productDetails.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(productDetails.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={productDetails.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};

export default ProductPage;