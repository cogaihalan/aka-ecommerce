"use client";
import { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type FAQAccordionProps = SliceComponentProps<any>;

const FAQAccordion: FC<FAQAccordionProps> = ({ slice }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const faqs = slice.items || [];
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
      className="py-8 md:py-16 bg-background text-foreground"
    >
      <div>
        {/* Header */}
        {(isFilled.richText(slice.primary.title) ||
          isFilled.richText(slice.primary.subtitle)) && (
          <div className={cn("mb-6 md:mb-8", getAlignmentClasses())}>
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

        {/* FAQ Items */}
        {faqs.length > 0 && (
          <div className="flex flex-col gap-4">
            {faqs.map((faq: any, index: number) => (
              <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 block" disableBlockPadding>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-auto p-6 justify-between text-left hover:bg-accent/50 transition-all duration-300",
                    isOpen(index) && "bg-accent/30 border-b border-border"
                  )}
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen(index)}
                  aria-controls={`faq-content-${index}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {showIcons && isFilled.image(faq.icon) && (
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={faq.icon.url}
                          alt={faq.icon.alt || "FAQ"}
                          className="w-5 h-5"
                        />
                      </div>
                    )}

                    {isFilled.keyText(faq.question) && (
                      <span className="text-lg font-semibold text-foreground leading-tight">
                        {faq.question}
                      </span>
                    )}
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={cn(
                        "transition-transform duration-300 text-muted-foreground",
                        isOpen(index) && "rotate-180"
                      )}
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
                </Button>

                <div
                  id={`faq-content-${index}`}
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen(index) ? "pt-6 max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                  aria-hidden={!isOpen(index)}
                >
                  <CardContent className="px-6 pb-6">
                    {isFilled.richText(faq.answer) && (
                      <div className="text-muted-foreground leading-relaxed">
                        <PrismicRichText 
                          field={faq.answer}
                          components={{
                            paragraph: ({ children }) => <p className="m-0 mb-4 last:mb-0">{children}</p>,
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        {isFilled.richText(slice.primary.footerText) && (
          <div className={cn("mt-8", getAlignmentClasses())}>
            <div className="text-sm text-muted-foreground leading-relaxed">
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

export default FAQAccordion;
