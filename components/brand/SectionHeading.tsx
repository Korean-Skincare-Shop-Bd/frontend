interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ title, description, className = '' }: SectionHeadingProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          {description}
        </p>
      )}
    </div>
  );
}