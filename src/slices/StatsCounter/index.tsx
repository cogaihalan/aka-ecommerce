"use client";
import { FC, useState, useEffect } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type StatsCounterProps = SliceComponentProps<any>;

const StatsCounter: FC<StatsCounterProps> = ({ slice }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState<number[]>([]);

  const stats = slice.items || [];
  const layout = slice.primary.layout || "grid";
  const animationDuration = slice.primary.animationDuration || 2000;
  const showIcons = slice.primary.showIcons !== false;
  const alignment = slice.primary.alignment || "center";

  // Initialize counters
  useEffect(() => {
    setCounters(stats.map(() => 0));
  }, [stats]);

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(
      `[data-slice-type="${slice.slice_type}"]`
    );
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [slice.slice_type]);

  // Animate counters when visible
  useEffect(() => {
    if (!isVisible) return;

    const animateCounter = (index: number, target: number) => {
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(
          startValue + (target - startValue) * easeOutCubic
        );

        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = currentValue;
          return newCounters;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    stats.forEach((stat: any, index: number) => {
      const target = parseInt(stat.value) || 0;
      animateCounter(index, target);
    });
  }, [isVisible, stats, animationDuration]);

  const formatNumber = (
    value: number,
    suffix: string = "",
    prefix: string = ""
  ) => {
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(1)}K${suffix}`;
    }
    return `${prefix}${value}${suffix}`;
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "es-stats-counter--horizontal";
      case "vertical":
        return "es-stats-counter--vertical";
      default:
        return "es-stats-counter--grid";
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "es-stats-counter--left";
      case "right":
        return "es-stats-counter--right";
      default:
        return "es-stats-counter--center";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`es-bounded es-stats-counter ${getLayoutClass()} ${getAlignmentClass()}`}
    >
      <div className="es-bounded__content es-stats-counter__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div
            className={`es-stats-counter__header es-stats-counter__header--${alignment}`}
          >
            {isFilled.richText(slice.primary.title) && (
              <div className="es-stats-counter__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-stats-counter__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="es-stats-counter__stats">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="es-stats-counter__stat">
                {/* Icon */}
                {showIcons && isFilled.image(stat.icon) && (
                  <div className="es-stats-counter__stat-icon">
                    <img
                      src={stat.icon.url}
                      alt={stat.icon.alt || stat.label}
                      className="es-stats-counter__icon"
                    />
                  </div>
                )}

                {/* Counter */}
                <div className="es-stats-counter__stat-content">
                  <div className="es-stats-counter__counter">
                    {formatNumber(
                      counters[index] || 0,
                      stat.suffix || "",
                      stat.prefix || ""
                    )}
                  </div>

                  {isFilled.keyText(stat.label) && (
                    <div className="es-stats-counter__label">{stat.label}</div>
                  )}

                  {isFilled.richText(stat.description) && (
                    <div className="es-stats-counter__description">
                      <PrismicRichText field={stat.description} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {isFilled.richText(slice.primary.footerText) && (
          <div
            className={`es-stats-counter__footer es-stats-counter__footer--${alignment}`}
          >
            <div className="es-stats-counter__footer-text">
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

          .es-stats-counter {
            font-family: system-ui, sans-serif;
            background-color: #f8f9fa;
            color: #333;
          }

          .es-stats-counter__header {
            margin-bottom: 3rem;
          }

          .es-stats-counter__header--left {
            text-align: left;
          }

          .es-stats-counter__header--center {
            text-align: center;
          }

          .es-stats-counter__header--right {
            text-align: right;
          }

          .es-stats-counter__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-stats-counter__title * {
            margin: 0;
          }

          .es-stats-counter__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-stats-counter__subtitle * {
            margin: 0;
          }

          .es-stats-counter__header--left .es-stats-counter__subtitle,
          .es-stats-counter__header--right .es-stats-counter__subtitle {
            margin: 0;
          }

          .es-stats-counter__stats {
            display: grid;
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .es-stats-counter--grid .es-stats-counter__stats {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .es-stats-counter--horizontal .es-stats-counter__stats {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .es-stats-counter--vertical .es-stats-counter__stats {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto 3rem;
          }

          .es-stats-counter__stat {
            background: #fff;
            border-radius: 0.75rem;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .es-stats-counter__stat::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #16745f, #0d5e4c);
          }

          .es-stats-counter__stat:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
          }

          .es-stats-counter__stat-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #16745f, #0d5e4c);
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .es-stats-counter__icon {
            width: 32px;
            height: 32px;
            filter: brightness(0) invert(1);
          }

          .es-stats-counter__stat-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .es-stats-counter__counter {
            font-size: 3rem;
            font-weight: 700;
            color: #16745f;
            line-height: 1;
            margin-bottom: 0.5rem;
          }

          .es-stats-counter__label {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 0.5rem;
          }

          .es-stats-counter__description {
            font-size: 0.875rem;
            color: #666;
            line-height: 1.5;
            max-width: 200px;
          }

          .es-stats-counter__description * {
            margin: 0;
          }

          .es-stats-counter__footer {
            margin-top: 2rem;
          }

          .es-stats-counter__footer--left {
            text-align: left;
          }

          .es-stats-counter__footer--center {
            text-align: center;
          }

          .es-stats-counter__footer--right {
            text-align: right;
          }

          .es-stats-counter__footer-text {
            font-size: 0.875rem;
            color: #666;
            line-height: 1.6;
          }

          .es-stats-counter__footer-text * {
            margin: 0;
          }

          @media (max-width: 768px) {
            .es-stats-counter__stats {
              grid-template-columns: 1fr !important;
            }

            .es-stats-counter__counter {
              font-size: 2.5rem;
            }

            .es-stats-counter__title {
              font-size: 2rem;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .es-stats-counter--grid .es-stats-counter__stats {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}
      </style>
    </section>
  );
};

export default StatsCounter;
