import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import Notice from './Notice';
import { IAnnouncement } from '../../interfaces';

interface CustomCarouselProps {
  announcements: IAnnouncement[];
  itemsPerSlide: number;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ announcements, itemsPerSlide, isAdmin, onDelete }) => {
  const chunkSize = itemsPerSlide;
  const chunks = [];

  for (let i = 0; i < announcements.length; i += chunkSize) {
    chunks.push(announcements.slice(i, i + chunkSize));
  }

  return (
    <Carousel interval={3000} controls={true} indicators={true}>
      {chunks.map((chunk, index) => (
        <Carousel.Item key={index}>
          <Row>
            {chunk.map((announcement) => (
              <Col md={12 / itemsPerSlide} key={announcement.id}>
                <Notice
                  isAdmin={isAdmin}
                  onDelete={() => onDelete(announcement.id)}
                  poster={announcement.poster}
                  contact_info={announcement.contact_info}
                  title={announcement.title}
                  content={announcement.content}
                  file={announcement.file}
                />
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;