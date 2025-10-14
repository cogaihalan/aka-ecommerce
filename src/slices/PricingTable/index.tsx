import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type PricingTableProps = SliceComponentProps<any>;

const PricingTable: FC<PricingTableProps> = ({ slice }) => {
  const plans = slice.items || [];
  const layout = slice.primary.layout || "grid";
  const highlightPlan = slice.primary.highlightPlan || 1;
  const showFeatures = slice.primary.showFeatures !== false;
  const showButtons = slice.primary.showButtons !== false;

  const getLayoutClass = () => {
    switch (layout) {
      case "table": return "es-pricing-table--table";
      case "cards": return "es-pricing-table--cards";
      default: return "es-pricing-table--grid";
    }
  };

  const renderFeatures = (features: string[]) => {
    if (!features || features.length === 0) return null;

    return (
      <ul className="es-pricing-table__features">
        {features.map((feature, index) => (
          <li key={index} className="es-pricing-table__feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="es-pricing-table__check-icon">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`es-bounded es-pricing-table ${getLayoutClass()}`}
    >
      <div className="es-bounded__content es-pricing-table__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className="es-pricing-table__header">
            {isFilled.richText(slice.primary.title) && (
              <div className="es-pricing-table__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-pricing-table__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Pricing Plans */}
        {plans.length > 0 && (
          <div className="es-pricing-table__plans">
            {plans.map((plan: any, index: number) => (
              <div 
                key={index} 
                className={`es-pricing-table__plan ${
                  index === highlightPlan - 1 ? 'es-pricing-table__plan--highlighted' : ''
                }`}
              >
                {/* Plan Header */}
                <div className="es-pricing-table__plan-header">
                  {isFilled.keyText(plan.name) && (
                    <h3 className="es-pricing-table__plan-name">
                      {plan.name}
                    </h3>
                  )}
                  
                  {isFilled.keyText(plan.description) && (
                    <p className="es-pricing-table__plan-description">
                      {plan.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="es-pricing-table__plan-price">
                    {isFilled.keyText(plan.price) && (
                      <span className="es-pricing-table__price">
                        {plan.price}
                      </span>
                    )}
                    {isFilled.keyText(plan.period) && (
                      <span className="es-pricing-table__period">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* Badge */}
                  {isFilled.keyText(plan.badge) && (
                    <div className="es-pricing-table__plan-badge">
                      {plan.badge}
                    </div>
                  )}
                </div>

                {/* Plan Features */}
                {showFeatures && plan.features && plan.features.length > 0 && (
                  <div className="es-pricing-table__plan-features">
                    {renderFeatures(plan.features)}
                  </div>
                )}

                {/* Plan Button */}
                {showButtons && isFilled.link(plan.link) && (
                  <div className="es-pricing-table__plan-button-container">
                    <PrismicNextLink
                      field={plan.link}
                      className={`es-pricing-table__plan-button ${
                        index === highlightPlan - 1 ? 'es-pricing-table__plan-button--primary' : 'es-pricing-table__plan-button--secondary'
                      }`}
                    >
                      {plan.buttonText || "Choose Plan"}
                    </PrismicNextLink>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {isFilled.richText(slice.primary.footerText) && (
          <div className="es-pricing-table__footer">
            <div className="es-pricing-table__footer-text">
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

          .es-pricing-table {
            font-family: system-ui, sans-serif;
            background-color: #fff;
            color: #333;
          }

          .es-pricing-table__header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .es-pricing-table__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-pricing-table__title * {
            margin: 0;
          }

          .es-pricing-table__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-pricing-table__subtitle * {
            margin: 0;
          }

          .es-pricing-table__plans {
            display: grid;
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .es-pricing-table--grid .es-pricing-table__plans {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }

          .es-pricing-table--cards .es-pricing-table__plans {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .es-pricing-table--table .es-pricing-table__plans {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .es-pricing-table__plan {
            background: #fff;
            border: 2px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 2rem;
            position: relative;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
          }

          .es-pricing-table--table .es-pricing-table__plan {
            border-radius: 0;
            border-bottom: 1px solid #e5e7eb;
            flex-direction: row;
            align-items: center;
            gap: 2rem;
          }

          .es-pricing-table--table .es-pricing-table__plan:first-child {
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
          }

          .es-pricing-table--table .es-pricing-table__plan:last-child {
            border-bottom-left-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
            border-bottom: 2px solid #e5e7eb;
          }

          .es-pricing-table__plan:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
          }

          .es-pricing-table__plan--highlighted {
            border-color: #16745f;
            transform: scale(1.05);
            box-shadow: 0 10px 25px -3px rgba(22, 116, 95, 0.2);
          }

          .es-pricing-table__plan--highlighted::before {
            content: "Most Popular";
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: #16745f;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 600;
          }

          .es-pricing-table__plan-header {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
          }

          .es-pricing-table--table .es-pricing-table__plan-header {
            text-align: left;
            margin-bottom: 0;
            flex: 1;
          }

          .es-pricing-table__plan-name {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
          }

          .es-pricing-table__plan-description {
            font-size: 1rem;
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }

          .es-pricing-table__plan-price {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .es-pricing-table--table .es-pricing-table__plan-price {
            justify-content: flex-start;
          }

          .es-pricing-table__price {
            font-size: 3rem;
            font-weight: 700;
            color: #16745f;
          }

          .es-pricing-table__period {
            font-size: 1rem;
            color: #666;
          }

          .es-pricing-table__plan-badge {
            position: absolute;
            top: -0.5rem;
            right: -0.5rem;
            background: #fbbf24;
            color: #92400e;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .es-pricing-table__plan-features {
            flex: 1;
            margin-bottom: 2rem;
          }

          .es-pricing-table--table .es-pricing-table__plan-features {
            flex: 2;
            margin-bottom: 0;
          }

          .es-pricing-table__features {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .es-pricing-table__feature {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: #4b5563;
          }

          .es-pricing-table__check-icon {
            color: #16745f;
            flex-shrink: 0;
          }

          .es-pricing-table__plan-button-container {
            margin-top: auto;
          }

          .es-pricing-table--table .es-pricing-table__plan-button-container {
            margin-top: 0;
            flex: 0 0 auto;
          }

          .es-pricing-table__plan-button {
            display: inline-block;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            width: 100%;
          }

          .es-pricing-table__plan-button--primary {
            background-color: #16745f;
            color: #fff;
            border: 2px solid #16745f;
          }

          .es-pricing-table__plan-button--primary:hover {
            background-color: #0d5e4c;
            border-color: #0d5e4c;
          }

          .es-pricing-table__plan-button--secondary {
            background-color: transparent;
            color: #16745f;
            border: 2px solid #16745f;
          }

          .es-pricing-table__plan-button--secondary:hover {
            background-color: #16745f;
            color: #fff;
          }

          .es-pricing-table__footer {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
          }

          .es-pricing-table__footer-text {
            font-size: 0.875rem;
            color: #666;
            line-height: 1.6;
          }

          .es-pricing-table__footer-text * {
            margin: 0;
          }

          @media (max-width: 768px) {
            .es-pricing-table--table .es-pricing-table__plan {
              flex-direction: column;
              text-align: center;
            }

            .es-pricing-table--table .es-pricing-table__plan-header {
              text-align: center;
            }

            .es-pricing-table--table .es-pricing-table__plan-price {
              justify-content: center;
            }

            .es-pricing-table__plans {
              grid-template-columns: 1fr !important;
            }

            .es-pricing-table__plan--highlighted {
              transform: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default PricingTable;
