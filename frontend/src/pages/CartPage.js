import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/common/Message';
import ButtonLoader from '../components/common/ButtonLoader';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const CartPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const { cartItems } = useSelector((state) => state.cart);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [removeError, setRemoveError] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(addToCart({ id, qty }));
    }
  }, [dispatch, id, qty]);
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.src = '/images/no-image.svg';
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
  };

  const removeFromCartHandler = (id) => {
    setRemovingItemId(id);
    setRemoveError(null);
    dispatch(removeFromCart(id))
      .unwrap()
      .then(() => {
        // Success
      })
      .catch((error) => {
        console.error('Failed to remove item from cart:', error);
        setRemoveError(`Failed to remove item: ${error}`);
        setTimeout(() => setRemoveError(null), 5000); // Clear error after 5 seconds
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {removeError && <Message variant="danger">{removeError}</Message>}
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fluid 
                      rounded 
                      onError={handleImageError}
                    />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart({
                            id: item.product,
                            qty: Number(e.target.value),
                          })
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                      disabled={removingItemId === item.product}
                    >
                      {removingItemId === item.product ? (
                        <ButtonLoader size="sm" />
                      ) : (
                        <i className='fas fa-trash'></i>
                      )}
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;