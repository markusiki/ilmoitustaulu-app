import { useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import Section from "./Section";
import AddAnnouncementForm from "./AddAnnouncementForm";

interface Announcement {
  title: string;
  description: string;
}

export default function NoticeBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({
    Tarjoukset: [],
    Asiakastoiveet: [],
    Myynti: [],
  });

  const handleAddAnnouncement = (newAnnouncement: {
    category: "Asiakastoiveet" | "Myynti";
    title: string;
    content: string;
  }) => {
    setAnnouncements((prevAnnouncements) => {
      const updatedCategory = [
        ...(prevAnnouncements[newAnnouncement.category] || []),
        { title: newAnnouncement.title, description: newAnnouncement.content },
      ];

      return {
        ...prevAnnouncements,
        [newAnnouncement.category]: updatedCategory,
      };
    });

    setIsModalOpen(false);
  };

  return (
    <Container fluid>
      <h1 className="text-center mb-4">Ilmoitustaulu</h1>

      {/* Main Grid Layout with React Bootstrap */}
      <Row className="mb-4">
        <Col md={4}>
          <Section title="Tarjoukset" announcements={announcements.Tarjoukset} />
        </Col>
        <Col md={8}>
          <Section title="Asiakastoiveet" announcements={announcements.Asiakastoiveet} />
        </Col>
      </Row>

      <Row>
        <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
          <p className="text-center">Lisää oma ilmoituksesi skannaamalla QR-koodi</p>
          <img src="QR_Test.svg" alt="QR Code" className="img-fluid" style={{ width: "100px" }} />
        </Col>
        <Col md={8}>
          <Section title="Myynti-ilmoitukset" announcements={announcements.Myynti} />
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add New Announcement
        </Button>
      </div>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAnnouncementForm onAddAnnouncement={handleAddAnnouncement} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}