"use client";
import { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export type NewsletterSignupProps = SliceComponentProps<any>;

const NewsletterSignup: FC<NewsletterSignupProps> = ({ slice }) => {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const layout = slice.primary.layout || "centered";
  const showImage = slice.primary.showImage !== false;

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "left":
        return "flex-row";
      case "right":
        return "flex-row-reverse";
      case "split":
        return "flex-row";
      default:
        return "flex-col text-center";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-8 md:py-16 bg-muted/50 text-foreground"
    >
      <div>
        <div className={cn("flex items-center gap-8", getLayoutClasses())}>
          {/* Image */}
          {showImage && isFilled.image(slice.primary.image) && (
            <div className={cn(
              "flex-1 max-w-md",
              layout === "centered" && "max-w-full w-full"
            )}>
              <img
                src={slice.primary.image.url}
                alt={slice.primary.image.alt || "Newsletter"}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className={cn(
            "flex-1",
            layout === "centered" && "max-w-full w-full"
          )}>
            {/* Header */}
            {(isFilled.richText(slice.primary.title) ||
              isFilled.richText(slice.primary.subtitle)) && (
              <div className="mb-8">
                {isFilled.richText(slice.primary.title) && (
                  <div className="text-4xl font-bold mb-4">
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
                  <div className="text-lg opacity-90">
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

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={onSubmit}>
                <div className="flex gap-4 mb-4 max-w-md mx-auto">
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder={slice.primary.placeholder || "Enter your email address"}
                    className="flex-1 bg-background/10 text-foreground placeholder:text-foreground/70"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isSubmitting}
                  >
                    {slice.primary.buttonText || "Subscribe"}
                  </Button>
                </div>

                {error && (
                  <div className="text-destructive text-sm mb-4">{error}</div>
                )}

                {/* Privacy Notice */}
                {isFilled.richText(slice.primary.privacyNotice) && (
                  <div className="text-sm opacity-80">
                    <PrismicRichText 
                      field={slice.primary.privacyNotice}
                      components={{
                        paragraph: ({ children }) => <p className="m-0">{children}</p>,
                      }}
                    />
                  </div>
                )}
              </form>
            ) : (
              /* Success Message */
              <Card className="text-center p-8 bg-background/10 border-background/30">
                <CardContent>
                  <div className="w-12 h-12 mx-auto mb-4 text-green-400">
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
                  <h3 className="text-xl font-semibold mb-2">
                    {slice.primary.successTitle || "Thank you for subscribing!"}
                  </h3>
                  <p className="opacity-90">
                    {slice.primary.successMessage ||
                      "You'll receive our latest updates soon."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {slice.primary.features && slice.primary.features.length > 0 && (
              <div className="flex flex-col gap-3 mt-6">
                {slice.primary.features.map((feature: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-sm opacity-90">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-green-400 flex-shrink-0"
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
    </section>
  );
};

export default NewsletterSignup;
