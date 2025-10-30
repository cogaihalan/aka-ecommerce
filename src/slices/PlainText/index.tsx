import { FC } from "react";
import { isFilled, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { HeadingField, RichTextField } from "@/components/prismic/fields";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export type PlainTextProps = SliceComponentProps<Content.PlainTextSlice>;

const PlainText: FC<PlainTextProps> = ({ slice }) => {
  const horizontal = slice.primary.horizontal_position || "left";
  const alignment = slice.primary.content_alignment || "left";
  const vertical = slice.primary.vertical_position || "top";

  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  const textAlign =
    alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";

  const justify =
    horizontal === "center" ? "justify-center" : horizontal === "right" ? "justify-end" : "justify-start";

  const items =
    vertical === "middle" ? "items-center" : vertical === "bottom" ? "items-end" : "items-start";

  const actions = (slice.primary.call_to_actions || []) as any[];

  return (
    <section
      ref={ref}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        "relative min-w-0 bg-white text-gray-900 py-8 lg:py-16",
        "transition-all duration-700 ease-out",
        hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className={cn("w-full flex", justify, items)}>
        <div className={cn("max-w-3xl w-full space-y-4", textAlign)}>
          {isFilled.richText(slice.primary.title) && (
            <HeadingField
              field={slice.primary.title}
            />
          )}

          {isFilled.richText(slice.primary.description) && (
            <RichTextField
              field={slice.primary.description}
              className={cn(
                "text-base sm:text-lg text-muted-foreground",
                "transition-all duration-500 ease-out",
                hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
            />
          )}

          {actions.length > 0 && (
            <div
              className={cn(
                "flex gap-3 flex-wrap",
                horizontal === "center" ? "justify-center" : horizontal === "right" ? "justify-end" : "justify-start",
                "transition-all duration-500 ease-out",
                hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transitionDelay: hasIntersected ? "200ms" : "0ms" }}
            >
              {actions.map((link, idx) => {
                const variant = (link as any)?.variant ?? (link as any)?.value?.variant ?? "Primary";
                const isPrimary = String(variant).toLowerCase() === "primary";
                return (
                  <PrismicNextLink
                    key={idx}
                    field={link}
                    className={cn(
                      "inline-flex items-center justify-center rounded-lg text-sm sm:text-base font-semibold px-4 py-2 lg:px-6 lg:py-3 transition-all duration-300",
                      isPrimary
                        ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlainText;
