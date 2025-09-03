import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <div className="sidebar bg-light p-3" style={{ minHeight: '100vh', borderRight: '1px solid #dee2e6' }}>
      <h5 className="mb-3">Account</h5>
      <Nav className="flex-column">
        <LinkContainer to="/profile">
          <Nav.Link className="py-2">
            <i className="fas fa-user me-2"></i>
            Profile Settings
          </Nav.Link>
        </LinkContainer>
        
        <LinkContainer to="/orders">
          <Nav.Link className="py-2">
            <i className="fas fa-shopping-bag me-2"></i>
            My Orders
          </Nav.Link>
        </LinkContainer>
        
        <LinkContainer to="/wishlist">
          <Nav.Link className="py-2">
            <i className="fas fa-heart me-2"></i>
            Wishlist
          </Nav.Link>
        </LinkContainer>
        
        <LinkContainer to="/addresses">
          <Nav.Link className="py-2">
            <i className="fas fa-map-marker-alt me-2"></i>
            Addresses
          </Nav.Link>
        </LinkContainer>
        
        {userInfo && userInfo.isAdmin && (
          <>
            <hr className="my-3" />
            <h6 className="mb-2 text-muted">Admin</h6>
            <LinkContainer to="/admin/userlist">
              <Nav.Link className="py-2">
                <i className="fas fa-users me-2"></i>
                Manage Users
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/admin/productlist">
              <Nav.Link className="py-2">
                <i className="fas fa-box me-2"></i>
                Manage Products
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/admin/orderlist">
              <Nav.Link className="py-2">
                <i className="fas fa-clipboard-list me-2"></i>
                Manage Orders
              </Nav.Link>
            </LinkContainer>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;