import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PricingTableProps = SliceComponentProps<any>;

const PricingTable: FC<PricingTableProps> = ({ slice }) => {
  const plans = slice.items || [];
  const layout = slice.primary.layout || "grid";
  const highlightPlan = slice.primary.highlightPlan || 1;
  const showFeatures = slice.primary.showFeatures !== false;
  const showButtons = slice.primary.showButtons !== false;

  const getLayoutClasses = () => {
    switch (layout) {
      case "table": return "flex flex-col gap-0";
      case "cards": return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      default: return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  const renderFeatures = (features: string[]) => {
    if (!features || features.length === 0) return null;

    return (
      <ul className="list-none p-0 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0">
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
      className="py-16 px-8 bg-background text-foreground"
    >
      <div className="mx-auto max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className="text-center mb-12">
            {isFilled.richText(slice.primary.title) && (
              <HeadingField field={slice.primary.title} className="text-4xl font-bold mb-4 text-foreground" />
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <RichTextField field={slice.primary.subtitle} className="text-lg text-muted-foreground max-w-2xl mx-auto" />
            )}
          </div>
        )}

        {/* Pricing Plans */}
        {plans.length > 0 && (
          <div className={cn("mb-12", getLayoutClasses())}>
            {plans.map((plan: any, index: number) => (
              <Card 
                key={index} 
                className={cn(
                  "relative transition-all duration-300 hover:-translate-y-1 h-full flex flex-col",
                  index === highlightPlan - 1 && "border-primary shadow-lg scale-105"
                )}
              >
                {/* Badge */}
                {isFilled.keyText(plan.badge) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </div>
                )}

                <CardHeader className="text-center">
                  {isFilled.keyText(plan.name) && (
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                  )}
                  
                  {isFilled.keyText(plan.description) && (
                    <p className="text-muted-foreground mt-2">
                      {plan.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline justify-center gap-2 mt-4">
                    {isFilled.keyText(plan.price) && (
                      <span className="text-4xl font-bold text-primary">
                        {plan.price}
                      </span>
                    )}
                    {isFilled.keyText(plan.period) && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Plan Features */}
                  {showFeatures && plan.features && plan.features.length > 0 && (
                    <div className="mb-8">
                      {renderFeatures(plan.features)}
                    </div>
                  )}

                  {/* Plan Button */}
                  {showButtons && isFilled.link(plan.link) && (
                    <div className="mt-auto">
                      <Button 
                        asChild 
                        className="w-full"
                        variant="default"
                      >
                        <PrismicNextLink field={plan.link}>
                          {plan.buttonText || "Choose Plan"}
                        </PrismicNextLink>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        {isFilled.richText(slice.primary.footerText) && (
          <div className="text-center pt-8 border-t">
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

export default PricingTable;
