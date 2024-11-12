import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { IAdvertisement } from "../../interfaces";

interface AdvertisementGridProps {
  advertisements: IAdvertisement[];
}

export default function AdvertisementGrid({ advertisements }: AdvertisementGridProps) {
  return (
    <div>
      <h2>Advertisements</h2>
      <Row>
        {advertisements.slice(0, 16).map((ad, index) => (
          <Col key={ad.id} xs={6} sm={4} md={3} className="mb-3">
            <Card>
              <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${ad.file}`}
                alt={`Advertisement ${index + 1}`}
              />
              <Card.Body>
                <Card.Text>tekstiä</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
