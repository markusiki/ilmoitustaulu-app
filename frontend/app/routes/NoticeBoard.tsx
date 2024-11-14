import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import Section from "./Section";
import AddAnnouncementForm from "./AddAnnouncementForm";
import AdvertisementGrid from "./AdvertisementGrid";
import { QRCodeSVG } from "qrcode.react";

import { DataFromServer, IAdvertisement, IAnnouncement } from "../../interfaces";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom.css';

export default function NoticeBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [announcementId, setAnnouncementId] = useState<string | null>(null);
  const advertisements = [
    { id: 1, file: 'juusto.jpg' },
    { id: 2, file: 'liha.jpg' },
    { id: 3, file: 'makarooni.jpg' },
    { id: 4, file: 'makkara.jpg' },
    { id: 5, file: 'leipa.jpg' },
    // Add more advertisements as needed
  ];
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000/announcements/");
    ws.current.onopen = () => {
      setStatus("Connected");
      console.log("Connected to WebSocket server");
    };
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
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

  const handleIncomingMessage = (message: DataFromServer) => {
    console.log("Received data:", message); // Log data to confirm structure
    if (message.type === "initialdata") {
      setAnnouncements(message.data.announcements);
      setAdvertisements(message.data.advertisements);
      setAnnouncementId(message.data.newAnnouncmentId); // Use data.announcmentId as sent from backend
    }
    if (message.type === "advertisementadd") {
      setAdvertisements((prev) => [...prev, message.data.advertisement]);
    }
    if (message.type === "advertisementdelete") {
      setAdvertisements((prev) =>
        prev.filter((advertisement) => advertisement.id !== message.data.id)
      );
    }
    if (message.type === "announcementadd") {
      const newAnnouncements = message.data.announcement;
      setAnnouncements((prev) => {
        return Array.isArray(newAnnouncements)
          ? [...prev, ...newAnnouncements]
          : [...prev, newAnnouncements];
      });
    }
    if (message.type === "announcementdelete") {
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== message.data.id)
      );
    }
    if (message.type === "newannouncementid") {
      setAnnouncementId(message.data.id);
    }
  };

  const handleAddAnnouncement = async (newAnnouncement: Omit<IAnnouncement, "id">) => {
    console.log("Using announcementId:", announcementId); // Log announcementId to confirm it's correct
    try {
      const initResponse = await fetch(`http://localhost:5000/new/${announcementId}/`);
      if (initResponse.ok) {
        const response = await fetch(
          `http://localhost:5000/api/announcements/add/${announcementId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newAnnouncement),
          }
        );
        if (response.ok) {
          console.log("Announcement saved and broadcasted.");
          setIsModalOpen(false);
        } else {
          console.error("Error saving announcement:", response.statusText);
        }
      } else {
        console.error("Initialization failed:", initResponse.statusText);
      }
    } catch (error) {
      console.error("Failed to add announcement:", error);
    }
  };

  const filterAnnouncementsByCategory = (category: string) =>
    announcements.filter((announcement) => announcement.category === category);

  return (
    <Container>
      <h1 className="custom-header text-center mb-4">Ilmoitustaulu</h1>
      <Row className="mb-4">
        <Col md={4}>
          <AdvertisementGrid advertisements={advertisements} />
        </Col>
        <Col md={8}>
          <Section
            title={<span className="section-title">Myynti-ilmoitukset</span>}
            announcements={filterAnnouncementsByCategory("myynti-ilmoitus")}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex align-items-center">
            <p className="qr-text text-center mr-3">
              Lisää oma ilmoituksesi QR-koodilla
            </p>
            <QRCodeSVG value={`http://localhost:5000/new/${announcementId}/`} size={150} />
          </div>
        </Col>
        <Col md={8}>
          <Section
            title={<span className="section-title">Asiakastoiveet</span>}
            announcements={filterAnnouncementsByCategory("asiakastoive")}
          />
        </Col>
      </Row>
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
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
