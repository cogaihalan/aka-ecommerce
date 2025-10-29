import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 3: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getCardVariant = () => {
    switch (cardStyle) {
      case "elevated":
        return "shadow-lg hover:shadow-xl";
      case "outlined":
        return "border-2 hover:border-primary";
      case "minimal":
        return "shadow-none border-none bg-transparent";
      default:
        return "shadow-sm hover:shadow-md";
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left": return "text-left";
      case "right": return "text-right";
      default: return "text-center";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 px-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className={cn("mb-12", getAlignmentClasses())}>
            {isFilled.richText(slice.primary.title) && (
              <HeadingField field={slice.primary.title} className="text-4xl font-bold mb-4 text-foreground" />
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <RichTextField 
                field={slice.primary.subtitle}
                className={cn(
                  "text-lg text-muted-foreground max-w-2xl",
                  alignment === "center" && "mx-auto"
                )}
              />
            )}
          </div>
        )}

        {/* Cards Grid */}
        {cards.length > 0 && (
          <div className={cn("grid gap-8 mb-12", getGridColumns())}>
            {cards.map((card: any, index: number) => (
              <Card 
                key={index} 
                className={cn(
                  "transition-all duration-300 hover:-translate-y-1 h-full flex flex-col",
                  getCardVariant(),
                  getAlignmentClasses()
                )}
              >
                {/* Card Image */}
                {showImages && isFilled.image(card.image) && (
                  <div className="relative aspect-video overflow-hidden">
                    <PrismicNextLink field={card.link}>
                      <PrismicNextImage
                        field={card.image}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </PrismicNextLink>
                  </div>
                )}

                <CardContent className="flex-1 flex flex-col">
                  {/* Icon */}
                  {isFilled.image(card.icon) && (
                    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-muted rounded-lg">
                      <PrismicNextImage
                        field={card.icon}
                        alt=""
                        className="w-6 h-6"
                      />
                    </div>
                  )}

                  {/* Title */}
                  {isFilled.keyText(card.title) && (
                    <CardTitle className="mb-3">
                      <PrismicNextLink 
                        field={card.link}
                        className="text-foreground no-underline hover:text-primary transition-colors duration-300"
                      >
                        {card.title}
                      </PrismicNextLink>
                    </CardTitle>
                  )}

                  {/* Description */}
                  {isFilled.richText(card.description) && (
                    <CardDescription className="mb-4 flex-1">
                      <PrismicRichText 
                        field={card.description}
                        components={{
                          paragraph: ({ children }) => <p className="m-0">{children}</p>,
                        }}
                      />
                    </CardDescription>
                  )}

                  {/* Features List */}
                  {card.features && card.features.length > 0 && (
                    <ul className="list-none p-0 mb-4">
                      {card.features.map((feature: any, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  {isFilled.keyText(card.price) && (
                    <div className="text-2xl font-bold text-primary mb-4">
                      {card.price}
                    </div>
                  )}

                  {/* Button */}
                  {showButtons && isFilled.link(card.link) && (
                    <div className="mt-auto">
                      <Button asChild className="w-full">
                        <PrismicNextLink field={card.link}>
                          {card.buttonText || "Learn More"}
                        </PrismicNextLink>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {isFilled.link(slice.primary.footerLink) && (
          <div className={cn("mt-8", getAlignmentClasses())}>
            <Button variant="outline" asChild>
              <PrismicNextLink field={slice.primary.footerLink}>
                {slice.primary.footerButtonText || "View All"}
              </PrismicNextLink>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MultiColumnCards;
