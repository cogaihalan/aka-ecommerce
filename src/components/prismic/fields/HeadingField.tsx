import { FC } from "react";
import { PrismicRichText, JSXMapSerializer } from "@prismicio/react";

type HeadingFieldProps = {
  field: any;
  className?: string;
  components?: JSXMapSerializer;
};

const defaultHeadingComponents: JSXMapSerializer = {
  heading1: ({ children }) => <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold m-0">{children}</h1>,
  heading2: ({ children }) => <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold m-0">{children}</h2>,
  heading3: ({ children }) => <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold m-0">{children}</h3>,
  heading4: ({ children }) => <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold m-0">{children}</h4>,
  heading5: ({ children }) => <h5 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold m-0">{children}</h5>,
  heading6: ({ children }) => <h6 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold m-0">{children}</h6>,
};

export const HeadingField: FC<HeadingFieldProps> = ({ field, className = '', components }) => {
  return (
    <div className={`${className}`}>
      <PrismicRichText field={field} components={components ?? defaultHeadingComponents} />
    </div>
  );
};

export default HeadingField;


