import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SessionExpiryModal = ({ show, handleExtendSession, handleClose }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Session Expiry Warning</Modal.Title>
    </Modal.Header>
    <Modal.Body>Your session is about to expire. Do you want to extend it by another 30 minutes?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleExtendSession}>
        Extend Session
      </Button>
    </Modal.Footer>
  </Modal>
);

export default SessionExpiryModal;
