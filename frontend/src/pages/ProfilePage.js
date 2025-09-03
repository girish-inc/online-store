import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/common/Message';
import ButtonLoader from '../components/common/ButtonLoader';
import Sidebar from '../components/layout/Sidebar';
import { getUserProfile, updateUserProfile, resetSuccess } from '../redux/slices/userSlice';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);
  const { userProfile, loading, error, success } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserProfile());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  // Update form fields when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (success) {
      setSuccessMessage('Profile Updated Successfully');
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        dispatch(resetSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const submitProfileHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    setIsUpdating(true);
    
    dispatch(
      updateUserProfile({
        id: userProfile._id,
        name,
        email,
      })
    )
      .unwrap()
      .catch((error) => {
        setMessage(error || 'Failed to update profile. Please try again.');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const submitPasswordHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      setIsUpdating(true);
      
      dispatch(
        updateUserProfile({
          id: userProfile._id,
          name: userProfile.name,
          email: userProfile.email,
          password: password,
        })
      )
        .unwrap()
        .then(() => {
          setPassword('');
          setConfirmPassword('');
          setShowPasswordForm(false);
        })
        .catch((error) => {
          setMessage(error || 'Failed to update password. Please try again.');
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="p-0">
          <Sidebar />
        </Col>
        <Col md={9}>
          <div className="p-4">
            <h2 className="mb-4">Profile Settings</h2>
            
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {successMessage && <Message variant='success'>{successMessage}</Message>}
            
            {loading && (
              <div className="text-center py-4">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading your profile information...</p>
              </div>
            )}
            
            {/* Profile Information Form */}
            {!loading && userProfile && (
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Personal Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={submitProfileHandler}>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId='name' className='mb-3'>
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Enter your full name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isValid={userProfile && name && name !== userProfile.name}
                            disabled={loading}
                            required
                          />
                          <Form.Text className="text-muted">
                            Your name as it will appear on your profile
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId='email' className='mb-3'>
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type='email'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isValid={userProfile && email && email !== userProfile.email}
                            disabled={loading}
                            required
                          />
                          <Form.Text className="text-muted">
                            Used for login and notifications
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button 
                      type='submit' 
                      variant='primary' 
                      disabled={isUpdating || loading || (userProfile && name === userProfile.name && email === userProfile.email)}
                    >
                      {isUpdating ? (
                        <ButtonLoader />
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Profile
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
            
            {/* Password Change Section */}
            {!loading && userProfile && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Password & Security</h5>
                  {!showPasswordForm && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      <i className="fas fa-key me-2"></i>
                      Change Password
                    </Button>
                  )}
                </Card.Header>
                <Card.Body>
                  {!showPasswordForm ? (
                    <p className="text-muted mb-0">
                      <i className="fas fa-shield-alt me-2"></i>
                      Your password is secure. Click "Change Password" to update it.
                    </p>
                  ) : (
                    <Form onSubmit={submitPasswordHandler}>
                      <Row>
                        <Col md={6}>
                          <Form.Group controlId='password' className='mb-3'>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                              type='password'
                              placeholder='Enter new password'
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              isInvalid={password && password.length < 6}
                              isValid={password && password.length >= 6 && password === confirmPassword}
                              disabled={loading}
                              required
                              minLength={6}
                            />
                            <Form.Text className="text-muted">
                              Password must be at least 6 characters
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId='confirmPassword' className='mb-3'>
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                              type='password'
                              placeholder='Confirm new password'
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              isInvalid={confirmPassword && password !== confirmPassword}
                              isValid={confirmPassword && password === confirmPassword && password.length >= 6}
                              disabled={loading}
                              required
                              minLength={6}
                            />
                            <Form.Text className="text-muted">
                              Passwords must match
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-flex gap-2">
                        <Button 
                          type='submit' 
                          variant='primary'
                          disabled={isUpdating || loading || !password || password.length < 6 || password !== confirmPassword}
                        >
                          {isUpdating ? (
                            <ButtonLoader />
                          ) : (
                            <>
                              <i className="fas fa-key me-2"></i>
                              Update Password
                            </>
                          )}
                        </Button>
                        <Button 
                          type='button' 
                          variant='secondary'
                          disabled={isUpdating || loading}
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPassword('');
                            setConfirmPassword('');
                            setMessage(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;