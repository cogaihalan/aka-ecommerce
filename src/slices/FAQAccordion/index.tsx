"use client";
import { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type FAQAccordionProps = SliceComponentProps<any>;

const FAQAccordion: FC<FAQAccordionProps> = ({ slice }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const faqs = slice.items || [];
  const layout = slice.primary.layout || "single";
  const allowMultiple = slice.primary.allowMultiple === true;
  const showIcons = slice.primary.showIcons !== false;
  const alignment = slice.primary.alignment || "center";

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);

      if (allowMultiple) {
        // Toggle individual item
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      } else {
        // Close all others and toggle current
        if (newSet.has(index)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(index);
        }
      }

      return newSet;
    });
  };

  const isOpen = (index: number) => openItems.has(index);

  const getLayoutClass = () => {
    switch (layout) {
      case "split":
        return "es-faq-accordion--split";
      case "grid":
        return "es-faq-accordion--grid";
      default:
        return "es-faq-accordion--single";
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "es-faq-accordion--left";
      case "right":
        return "es-faq-accordion--right";
      default:
        return "es-faq-accordion--center";
    }
  };

  const getGridColumns = () => {
    if (layout === "grid") {
      return faqs.length <= 2
        ? "repeat(2, 1fr)"
        : "repeat(auto-fit, minmax(300px, 1fr))";
    }
    return "1fr";
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`es-bounded es-faq-accordion ${getLayoutClass()} ${getAlignmentClass()}`}
    >
      <div className="es-bounded__content es-faq-accordion__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div
            className={`es-faq-accordion__header es-faq-accordion__header--${alignment}`}
          >
            {isFilled.richText(slice.primary.title) && (
              <div className="es-faq-accordion__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-faq-accordion__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* FAQ Items */}
        {faqs.length > 0 && (
          <div
            className="es-faq-accordion__items"
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="es-faq-accordion__item">
                <button
                  className={`es-faq-accordion__trigger ${isOpen(index) ? "es-faq-accordion__trigger--open" : ""}`}
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen(index)}
                  aria-controls={`faq-content-${index}`}
                >
                  <div className="es-faq-accordion__trigger-content">
                    {showIcons && isFilled.image(faq.icon) && (
                      <div className="es-faq-accordion__icon">
                        <img
                          src={faq.icon.url}
                          alt={faq.icon.alt || "FAQ"}
                          className="es-faq-accordion__icon-image"
                        />
                      </div>
                    )}

                    {isFilled.keyText(faq.question) && (
                      <span className="es-faq-accordion__question">
                        {faq.question}
                      </span>
                    )}
                  </div>

                  <div className="es-faq-accordion__chevron">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`es-faq-accordion__chevron-icon ${isOpen(index) ? "es-faq-accordion__chevron-icon--rotated" : ""}`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  id={`faq-content-${index}`}
                  className={`es-faq-accordion__content ${isOpen(index) ? "es-faq-accordion__content--open" : ""}`}
                  aria-hidden={!isOpen(index)}
                >
                  <div className="es-faq-accordion__content-inner">
                    {isFilled.richText(faq.answer) && (
                      <div className="es-faq-accordion__answer">
                        <PrismicRichText field={faq.answer} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {isFilled.richText(slice.primary.footerText) && (
          <div
            className={`es-faq-accordion__footer es-faq-accordion__footer--${alignment}`}
          >
            <div className="es-faq-accordion__footer-text">
              <PrismicRichText field={slice.primary.footerText} />
            </div>
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

          .es-faq-accordion {
            font-family: system-ui, sans-serif;
            background-color: #fff;
            color: #333;
          }

          .es-faq-accordion__header {
            margin-bottom: 3rem;
          }

          .es-faq-accordion__header--left {
            text-align: left;
          }

          .es-faq-accordion__header--center {
            text-align: center;
          }

          .es-faq-accordion__header--right {
            text-align: right;
          }

          .es-faq-accordion__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-faq-accordion__title * {
            margin: 0;
          }

          .es-faq-accordion__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-faq-accordion__subtitle * {
            margin: 0;
          }

          .es-faq-accordion__header--left .es-faq-accordion__subtitle,
          .es-faq-accordion__header--right .es-faq-accordion__subtitle {
            margin: 0;
          }

          .es-faq-accordion__items {
            display: grid;
            gap: 1rem;
            margin-bottom: 3rem;
          }

          .es-faq-accordion--single .es-faq-accordion__items {
            grid-template-columns: 1fr;
            max-width: 800px;
            margin: 0 auto 3rem;
          }

          .es-faq-accordion--split .es-faq-accordion__items {
            grid-template-columns: repeat(2, 1fr);
          }

          .es-faq-accordion__item {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .es-faq-accordion__item:hover {
            border-color: #16745f;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .es-faq-accordion__trigger {
            width: 100%;
            padding: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            transition: all 0.3s ease;
            position: relative;
          }

          .es-faq-accordion__trigger:hover {
            background-color: #f8f9fa;
          }

          .es-faq-accordion__trigger--open {
            background-color: #f0fdf4;
            border-bottom: 1px solid #e5e7eb;
          }

          .es-faq-accordion__trigger-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex: 1;
          }

          .es-faq-accordion__icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border-radius: 0.5rem;
            flex-shrink: 0;
          }

          .es-faq-accordion__icon-image {
            width: 20px;
            height: 20px;
          }

          .es-faq-accordion__question {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.4;
          }

          .es-faq-accordion__chevron {
            flex-shrink: 0;
            margin-left: 1rem;
          }

          .es-faq-accordion__chevron-icon {
            transition: transform 0.3s ease;
            color: #6b7280;
          }

          .es-faq-accordion__chevron-icon--rotated {
            transform: rotate(180deg);
          }

          .es-faq-accordion__content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .es-faq-accordion__content--open {
            max-height: 500px;
          }

          .es-faq-accordion__content-inner {
            padding: 0 1.5rem 1.5rem;
          }

          .es-faq-accordion__answer {
            font-size: 1rem;
            color: #4b5563;
            line-height: 1.6;
          }

          .es-faq-accordion__answer * {
            margin: 0;
          }

          .es-faq-accordion__answer p:not(:last-child) {
            margin-bottom: 1rem;
          }

          .es-faq-accordion__footer {
            margin-top: 2rem;
          }

          .es-faq-accordion__footer--left {
            text-align: left;
          }

          .es-faq-accordion__footer--center {
            text-align: center;
          }

          .es-faq-accordion__footer--right {
            text-align: right;
          }

          .es-faq-accordion__footer-text {
            font-size: 0.875rem;
            color: #666;
            line-height: 1.6;
          }

          .es-faq-accordion__footer-text * {
            margin: 0;
          }

          @media (max-width: 768px) {
            .es-faq-accordion--split .es-faq-accordion__items,
            .es-faq-accordion--grid .es-faq-accordion__items {
              grid-template-columns: 1fr !important;
            }

            .es-faq-accordion__title {
              font-size: 2rem;
            }

            .es-faq-accordion__trigger {
              padding: 1rem;
            }

            .es-faq-accordion__content-inner {
              padding: 0 1rem 1rem;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .es-faq-accordion--split .es-faq-accordion__items {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </section>
  );
};

export default FAQAccordion;
