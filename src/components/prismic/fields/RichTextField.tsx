import { FC } from "react";
import { PrismicRichText, JSXMapSerializer } from "@prismicio/react";

type RichTextFieldProps = {
  field: any;
  className?: string;
  components?: JSXMapSerializer;
};

const defaultParagraphComponents: JSXMapSerializer = {
  paragraph: ({ children }) => <p className="m-0">{children}</p>,
};

export const RichTextField: FC<RichTextFieldProps> = ({ field, className, components }) => {
  return (
    <div className={`wysiwyg ${className}`}>
      <PrismicRichText field={field} components={components ?? defaultParagraphComponents} />
    </div>
  );
};

export default RichTextField;


