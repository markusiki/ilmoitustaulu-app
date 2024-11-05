import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import Section from "./Section";
import AddAnnouncementForm from "./AddAnnouncementForm";

interface Announcement {
  id: string;
  category: string;
  title: string;
  content: string;
  poster?: string;
  contact_info?: string;
}

interface Advertisement {
  id: string;
  file: string;
}

export default function NoticeBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000/announcements/");

    ws.current.onopen = () => {
      setStatus("Connected");
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);
      handleIncomingMessage(data);
    };

    ws.current.onclose = () => {
      setStatus("Disconnected");
      console.log("Disconnected from WebSocket server");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleIncomingMessage = (data: any) => {
    if (data.announcements) {
      setAnnouncements(data.announcements);
    }
    if (data.advertisements) {
      setAdvertisements(data.advertisements);
    }
    if (data.type === "announcementadd" && data.data.announcement) {
      setAnnouncements((prev) => [...prev, data.data.announcement]);
    }
  };

  const handleAddAnnouncement = (newAnnouncement: Omit<Announcement, "id">) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const announcement = { ...newAnnouncement, id: Date.now().toString() };
      ws.current.send(JSON.stringify({ type: "announcementadd", data: { announcement } }));
      setAnnouncements((prev) => [...prev, announcement]); // Optimistically update
      setIsModalOpen(false);
    } else {
      console.error("WebSocket connection is not open");
    }
  };

  const filterAnnouncementsByCategory = (category: string) =>
    announcements.filter((announcement) => announcement.category === category);

  return (
    <Container fluid>
      <h1 className="text-center mb-4">Ilmoitustaulu</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Section
            title="Tarjoukset"
            announcements={filterAnnouncementsByCategory("tarjous")}
          />
        </Col>
        <Col md={8}>
          <Section
            title="Asiakastoiveet"
            announcements={filterAnnouncementsByCategory("asiakastoive")}
          />
        </Col>
      </Row>

      <Row>
        <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
          <p className="text-center">Lisää oma ilmoituksesi skannaamalla QR-koodi</p>
          <img src="QR_Test.svg" alt="QR Code" className="img-fluid" style={{ width: "100px" }} />
        </Col>
        <Col md={8}>
          <Section
            title="Myynti-ilmoitukset"
            announcements={filterAnnouncementsByCategory("myynti-ilmoitus")}
          />
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
          <AddAnnouncementForm
            onAddAnnouncement={(newAnnouncement) => {
              handleAddAnnouncement(newAnnouncement);
              setIsModalOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
