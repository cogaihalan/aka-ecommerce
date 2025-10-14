import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

export type MultiColumnCardsProps = SliceComponentProps<any>;

const MultiColumnCards: FC<MultiColumnCardsProps> = ({ slice }) => {
  const cards = slice.items || [];
  const columns = slice.primary.columns || 3;
  const cardStyle = slice.primary.cardStyle || "default";
  const showImages = slice.primary.showImages !== false;
  const showButtons = slice.primary.showButtons !== false;
  const alignment = slice.primary.alignment || "center";

  const getGridColumns = () => {
    switch (columns) {
      case 1: return "1fr";
      case 2: return "repeat(2, 1fr)";
      case 3: return "repeat(3, 1fr)";
      case 4: return "repeat(4, 1fr)";
      default: return "repeat(3, 1fr)";
    }
  };

  const getCardClassName = () => {
    const baseClass = "es-multi-column-cards__card";
    switch (cardStyle) {
      case "elevated":
        return `${baseClass} es-multi-column-cards__card--elevated`;
      case "outlined":
        return `${baseClass} es-multi-column-cards__card--outlined`;
      case "minimal":
        return `${baseClass} es-multi-column-cards__card--minimal`;
      default:
        return baseClass;
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="es-bounded es-multi-column-cards"
    >
      <div className="es-bounded__content es-multi-column-cards__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className={`es-multi-column-cards__header es-multi-column-cards__header--${alignment}`}>
            {isFilled.richText(slice.primary.title) && (
              <div className="es-multi-column-cards__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-multi-column-cards__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {cards.length > 0 && (
          <div 
            className="es-multi-column-cards__grid"
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            {cards.map((card: any, index: number) => (
              <div key={index} className={getCardClassName()}>
                {/* Card Image */}
                {showImages && isFilled.image(card.image) && (
                  <div className="es-multi-column-cards__card-image">
                    <PrismicNextLink field={card.link}>
                      <PrismicNextImage
                        field={card.image}
                        className="es-multi-column-cards__image"
                      />
                    </PrismicNextLink>
                  </div>
                )}

                {/* Card Content */}
                <div className="es-multi-column-cards__card-content">
                  {/* Icon */}
                  {isFilled.image(card.icon) && (
                    <div className="es-multi-column-cards__card-icon">
                      <PrismicNextImage
                        field={card.icon}
                        className="es-multi-column-cards__icon"
                      />
                    </div>
                  )}

                  {/* Title */}
                  {isFilled.keyText(card.title) && (
                    <h3 className="es-multi-column-cards__card-title">
                      <PrismicNextLink field={card.link}>
                        {card.title}
                      </PrismicNextLink>
                    </h3>
                  )}

                  {/* Description */}
                  {isFilled.richText(card.description) && (
                    <div className="es-multi-column-cards__card-description">
                      <PrismicRichText field={card.description} />
                    </div>
                  )}

                  {/* Features List */}
                  {card.features && card.features.length > 0 && (
                    <ul className="es-multi-column-cards__card-features">
                      {card.features.map((feature: any, featureIndex: number) => (
                        <li key={featureIndex} className="es-multi-column-cards__card-feature">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="es-multi-column-cards__check-icon">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  {isFilled.keyText(card.price) && (
                    <div className="es-multi-column-cards__card-price">
                      {card.price}
                    </div>
                  )}

                  {/* Button */}
                  {showButtons && isFilled.link(card.link) && (
                    <div className="es-multi-column-cards__card-button-container">
                      <PrismicNextLink
                        field={card.link}
                        className="es-multi-column-cards__card-button"
                      >
                        {card.buttonText || "Learn More"}
                      </PrismicNextLink>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {isFilled.link(slice.primary.footerLink) && (
          <div className={`es-multi-column-cards__footer es-multi-column-cards__footer--${alignment}`}>
            <PrismicNextLink
              field={slice.primary.footerLink}
              className="es-multi-column-cards__footer-button"
            >
              {slice.primary.footerButtonText || "View All"}
            </PrismicNextLink>
          </div>
        )}
      </div>

      <style>
        {`
          .es-bounded {
            padding: 8vw 2rem;
          }

          .es-bounded__content {
            margin-left: auto;
            margin-right: auto;
            max-width: 90%;
          }

          @media screen and (min-width: 640px) {
            .es-bounded__content {
              max-width: 85%;
            }
          }

          @media screen and (min-width: 896px) {
            .es-bounded__content {
              max-width: 80%;
            }
          }

          @media screen and (min-width: 1280px) {
            .es-bounded__content {
              max-width: 75%;
            }
          }

          .es-multi-column-cards {
            font-family: system-ui, sans-serif;
            background-color: #fff;
            color: #333;
          }

          .es-multi-column-cards__header {
            margin-bottom: 3rem;
          }

          .es-multi-column-cards__header--left {
            text-align: left;
          }

          .es-multi-column-cards__header--center {
            text-align: center;
          }

          .es-multi-column-cards__header--right {
            text-align: right;
          }

          .es-multi-column-cards__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-multi-column-cards__title * {
            margin: 0;
          }

          .es-multi-column-cards__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-multi-column-cards__subtitle * {
            margin: 0;
          }

          .es-multi-column-cards__header--left .es-multi-column-cards__subtitle,
          .es-multi-column-cards__header--right .es-multi-column-cards__subtitle {
            margin: 0;
          }

          .es-multi-column-cards__grid {
            display: grid;
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .es-multi-column-cards__card {
            background: #fff;
            border-radius: 0.75rem;
            overflow: hidden;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .es-multi-column-cards__card--elevated {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .es-multi-column-cards__card--elevated:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
          }

          .es-multi-column-cards__card--outlined {
            border: 2px solid #e5e7eb;
          }

          .es-multi-column-cards__card--outlined:hover {
            border-color: #16745f;
          }

          .es-multi-column-cards__card--minimal {
            background: transparent;
            border: none;
            box-shadow: none;
          }

          .es-multi-column-cards__card-image {
            position: relative;
            aspect-ratio: 16/9;
            overflow: hidden;
          }

          .es-multi-column-cards__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .es-multi-column-cards__card:hover .es-multi-column-cards__image {
            transform: scale(1.05);
          }

          .es-multi-column-cards__card-content {
            padding: 2rem;
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .es-multi-column-cards__card-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border-radius: 0.5rem;
          }

          .es-multi-column-cards__icon {
            width: 24px;
            height: 24px;
          }

          .es-multi-column-cards__card-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            line-height: 1.4;
          }

          .es-multi-column-cards__card-title a {
            color: #1a1a1a;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .es-multi-column-cards__card-title a:hover {
            color: #16745f;
          }

          .es-multi-column-cards__card-description {
            font-size: 1rem;
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
            flex: 1;
          }

          .es-multi-column-cards__card-description * {
            margin: 0;
          }

          .es-multi-column-cards__card-features {
            list-style: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
          }

          .es-multi-column-cards__card-feature {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: #4b5563;
          }

          .es-multi-column-cards__check-icon {
            color: #16745f;
            flex-shrink: 0;
          }

          .es-multi-column-cards__card-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #16745f;
            margin-bottom: 1.5rem;
          }

          .es-multi-column-cards__card-button-container {
            margin-top: auto;
          }

          .es-multi-column-cards__card-button {
            display: inline-block;
            background-color: #16745f;
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s ease;
            text-align: center;
            width: 100%;
          }

          .es-multi-column-cards__card-button:hover {
            background-color: #0d5e4c;
          }

          .es-multi-column-cards__footer {
            margin-top: 2rem;
          }

          .es-multi-column-cards__footer--left {
            text-align: left;
          }

          .es-multi-column-cards__footer--center {
            text-align: center;
          }

          .es-multi-column-cards__footer--right {
            text-align: right;
          }

          .es-multi-column-cards__footer-button {
            display: inline-block;
            background-color: transparent;
            color: #16745f;
            padding: 0.75rem 2rem;
            border: 2px solid #16745f;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .es-multi-column-cards__footer-button:hover {
            background-color: #16745f;
            color: #fff;
          }

          @media (max-width: 768px) {
            .es-multi-column-cards__grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .es-multi-column-cards__grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (min-width: 1025px) and (max-width: 1200px) {
            .es-multi-column-cards__grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default MultiColumnCards;
