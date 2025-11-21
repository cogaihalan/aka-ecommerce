"use client";
import { FC, useState, useEffect } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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
    return `${prefix}${value.toLocaleString()}${suffix}`;
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "grid-cols-2 md:grid-cols-4";
      case "vertical":
        return "grid-cols-1 max-w-md mx-auto";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-muted text-foreground"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div className={cn("mb-12", getAlignmentClasses())}>
            {isFilled.richText(slice.primary.title) && (
              <div className="text-4xl font-bold mb-4 text-foreground">
                <PrismicRichText 
                  field={slice.primary.title}
                  components={{
                    heading1: ({ children }) => <h1 className="m-0">{children}</h1>,
                    heading2: ({ children }) => <h2 className="m-0">{children}</h2>,
                    heading3: ({ children }) => <h3 className="m-0">{children}</h3>,
                    heading4: ({ children }) => <h4 className="m-0">{children}</h4>,
                    heading5: ({ children }) => <h5 className="m-0">{children}</h5>,
                    heading6: ({ children }) => <h6 className="m-0">{children}</h6>,
                  }}
                />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className={cn(
                "text-lg text-muted-foreground max-w-2xl",
                alignment === "center" && "mx-auto"
              )}>
                <PrismicRichText 
                  field={slice.primary.subtitle}
                  components={{
                    paragraph: ({ children }) => <p className="m-0">{children}</p>,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className={cn("grid gap-8 mb-12", getLayoutClasses())}>
            {stats.map((stat: any, index: number) => (
              <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
                
                <CardContent className="text-center p-8">
                  {/* Icon */}
                  {showIcons && isFilled.image(stat.icon) && (
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-md">
                      <img
                        src={stat.icon.url}
                        alt={stat.icon.alt || stat.label}
                        className="w-8 h-8 filter brightness-0 invert"
                      />
                    </div>
                  )}

                  {/* Counter */}
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {formatNumber(
                        counters[index] || 0,
                        stat.suffix || "",
                        stat.prefix || ""
                      )}
                    </div>

                    {isFilled.keyText(stat.label) && (
                      <div className="text-lg font-semibold text-foreground mb-2">
                        {stat.label}
                      </div>
                    )}

                    {isFilled.richText(stat.description) && (
                      <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                        <PrismicRichText 
                          field={stat.description}
                          components={{
                            paragraph: ({ children }) => <p className="m-0">{children}</p>,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        {isFilled.richText(slice.primary.footerText) && (
          <div className={cn("mt-8", getAlignmentClasses())}>
            <div className="text-sm text-muted-foreground">
              <PrismicRichText 
                field={slice.primary.footerText}
                components={{
                  paragraph: ({ children }) => <p className="m-0">{children}</p>,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsCounter;
