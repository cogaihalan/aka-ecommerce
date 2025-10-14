"use client";
import { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type NewsletterSignupProps = SliceComponentProps<any>;

const NewsletterSignup: FC<NewsletterSignupProps> = ({ slice }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const layout = slice.primary.layout || "centered";
  const showImage = slice.primary.showImage !== false;
  const backgroundColor = slice.primary.backgroundColor || "#16745f";
  const textColor = slice.primary.textColor || "#ffffff";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Here you would typically integrate with your email service
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "left":
        return "es-newsletter-signup--left";
      case "right":
        return "es-newsletter-signup--right";
      case "split":
        return "es-newsletter-signup--split";
      default:
        return "es-newsletter-signup--centered";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`es-bounded es-newsletter-signup ${getLayoutClass()}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="es-bounded__content es-newsletter-signup__content">
        <div className="es-newsletter-signup__container">
          {/* Image */}
          {showImage && isFilled.image(slice.primary.image) && (
            <div className="es-newsletter-signup__image-container">
              <img
                src={slice.primary.image.url}
                alt={slice.primary.image.alt || "Newsletter"}
                className="es-newsletter-signup__image"
              />
            </div>
          )}

          {/* Content */}
          <div className="es-newsletter-signup__content-wrapper">
            {/* Header */}
            {(isFilled.richText(slice.primary.title) ||
              isFilled.richText(slice.primary.subtitle)) && (
              <div className="es-newsletter-signup__header">
                {isFilled.richText(slice.primary.title) && (
                  <div className="es-newsletter-signup__title">
                    <PrismicRichText field={slice.primary.title} />
                  </div>
                )}
                {isFilled.richText(slice.primary.subtitle) && (
                  <div className="es-newsletter-signup__subtitle">
                    <PrismicRichText field={slice.primary.subtitle} />
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="es-newsletter-signup__form"
              >
                <div className="es-newsletter-signup__form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      slice.primary.placeholder || "Enter your email address"
                    }
                    className="es-newsletter-signup__input"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="es-newsletter-signup__button"
                  >
                    {isSubmitting ? (
                      <div className="es-newsletter-signup__spinner">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            opacity="0.25"
                          />
                          <path
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    ) : (
                      slice.primary.buttonText || "Subscribe"
                    )}
                  </button>
                </div>

                {error && (
                  <div className="es-newsletter-signup__error">{error}</div>
                )}

                {/* Privacy Notice */}
                {isFilled.richText(slice.primary.privacyNotice) && (
                  <div className="es-newsletter-signup__privacy">
                    <PrismicRichText field={slice.primary.privacyNotice} />
                  </div>
                )}
              </form>
            ) : (
              /* Success Message */
              <div className="es-newsletter-signup__success">
                <div className="es-newsletter-signup__success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="es-newsletter-signup__success-title">
                  {slice.primary.successTitle || "Thank you for subscribing!"}
                </div>
                <div className="es-newsletter-signup__success-message">
                  {slice.primary.successMessage ||
                    "You'll receive our latest updates soon."}
                </div>
              </div>
            )}

            {/* Features */}
            {slice.primary.features && slice.primary.features.length > 0 && (
              <div className="es-newsletter-signup__features">
                {slice.primary.features.map((feature: any, index: number) => (
                  <div key={index} className="es-newsletter-signup__feature">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="es-newsletter-signup__feature-icon"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

          .es-newsletter-signup {
            font-family: system-ui, sans-serif;
            border-radius: 1rem;
            overflow: hidden;
          }

          .es-newsletter-signup__container {
            display: flex;
            align-items: center;
            gap: 3rem;
            min-height: 400px;
          }

          .es-newsletter-signup--centered .es-newsletter-signup__container {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }

          .es-newsletter-signup--left .es-newsletter-signup__container {
            flex-direction: row;
          }

          .es-newsletter-signup--right .es-newsletter-signup__container {
            flex-direction: row-reverse;
          }

          .es-newsletter-signup--split .es-newsletter-signup__container {
            flex-direction: row;
          }

          .es-newsletter-signup__image-container {
            flex: 1;
            max-width: 50%;
          }

          .es-newsletter-signup--centered .es-newsletter-signup__image-container {
            max-width: 100%;
            width: 100%;
          }

          .es-newsletter-signup__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.5rem;
          }

          .es-newsletter-signup__content-wrapper {
            flex: 1;
            max-width: 50%;
          }

          .es-newsletter-signup--centered .es-newsletter-signup__content-wrapper {
            max-width: 100%;
            width: 100%;
          }

          .es-newsletter-signup__header {
            margin-bottom: 2rem;
          }

          .es-newsletter-signup__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.2;
          }

          .es-newsletter-signup__title * {
            margin: 0;
          }

          .es-newsletter-signup__subtitle {
            font-size: 1.125rem;
            opacity: 0.9;
            line-height: 1.6;
          }

          .es-newsletter-signup__subtitle * {
            margin: 0;
          }

          .es-newsletter-signup__form {
            margin-bottom: 2rem;
          }

          .es-newsletter-signup__form-group {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .es-newsletter-signup__input {
            flex: 1;
            padding: 1rem 1.5rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: inherit;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .es-newsletter-signup__input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }

          .es-newsletter-signup__input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.2);
          }

          .es-newsletter-signup__button {
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 0.5rem;
            color: inherit;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 120px;
          }

          .es-newsletter-signup__button:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
          }

          .es-newsletter-signup__button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .es-newsletter-signup__spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .es-newsletter-signup__error {
            color: #ff6b6b;
            font-size: 0.875rem;
            margin-top: 0.5rem;
          }

          .es-newsletter-signup__privacy {
            font-size: 0.875rem;
            opacity: 0.8;
            line-height: 1.5;
          }

          .es-newsletter-signup__privacy * {
            margin: 0;
          }

          .es-newsletter-signup__success {
            text-align: center;
            padding: 2rem 0;
          }

          .es-newsletter-signup__success-icon {
            margin: 0 auto 1rem;
            width: 48px;
            height: 48px;
            color: #4ade80;
          }

          .es-newsletter-signup__success-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .es-newsletter-signup__success-message {
            font-size: 1rem;
            opacity: 0.9;
          }

          .es-newsletter-signup__features {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .es-newsletter-signup__feature {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            opacity: 0.9;
          }

          .es-newsletter-signup__feature-icon {
            color: #4ade80;
            flex-shrink: 0;
          }

          @media (max-width: 768px) {
            .es-newsletter-signup__container {
              flex-direction: column;
              text-align: center;
              gap: 2rem;
            }

            .es-newsletter-signup__image-container,
            .es-newsletter-signup__content-wrapper {
              max-width: 100%;
            }

            .es-newsletter-signup__form-group {
              flex-direction: column;
            }

            .es-newsletter-signup__button {
              width: 100%;
            }

            .es-newsletter-signup__title {
              font-size: 2rem;
            }
          }
        `}
      </style>
    </section>
  );
};

export default NewsletterSignup;
